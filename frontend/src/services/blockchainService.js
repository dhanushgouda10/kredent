import { ethers } from 'ethers'
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  EXPECTED_CHAIN_ID_HEX,
  NETWORK_NAME,
  BLOCK_EXPLORER_URL,
  AMOY_PUBLIC_RPC_URL,
} from '../contracts/skillChainConfig'

/**
 * All MetaMask / on-chain interaction lives in this one file. This is the ONLY place in the
 * whole app that touches window.ethereum for a transaction (AdminLoginPage.jsx separately uses
 * it just to read the connected address for login — unrelated to this).
 *
 * Nothing here ever asks for or sees a private key: window.ethereum + a MetaMask-backed
 * ethers.BrowserProvider means MetaMask itself signs everything, entirely inside the extension.
 * This code never has access to the signing key at any point.
 */

function getEthereumProvider() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install the MetaMask browser extension to continue.')
  }
  return window.ethereum
}

function assertContractConfigured() {
  if (!CONTRACT_ADDRESS) {
    throw new Error('The smart contract address is not configured (VITE_CONTRACT_ADDRESS is missing).')
  }
}

/** Asks MetaMask which account is connected (prompts the connect popup if not already connected). */
export async function connectAdminWallet() {
  const ethereum = getEthereumProvider()
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  if (!accounts || accounts.length === 0) {
    throw new Error('No MetaMask account was returned. Please unlock MetaMask and try again.')
  }
  return accounts[0]
}

/**
 * Ensures MetaMask's connected network matches EXPECTED_CHAIN_ID_HEX. If it doesn't, tries to
 * switch automatically via wallet_switchEthereumChain (this only prompts a MetaMask popup — it
 * never touches a private key). If MetaMask doesn't have the network at all yet (error code
 * 4902), falls back to wallet_addEthereumChain to add Polygon Amoy, then re-reads eth_chainId to
 * confirm the switch actually took effect before letting the caller proceed.
 */
async function ensureCorrectNetwork() {
  const ethereum = getEthereumProvider()
  const chainId = await ethereum.request({ method: 'eth_chainId' })
  if (chainId.toLowerCase() === EXPECTED_CHAIN_ID_HEX.toLowerCase()) {
    return
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: EXPECTED_CHAIN_ID_HEX }],
    })
  } catch (switchError) {
    if (switchError?.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: EXPECTED_CHAIN_ID_HEX,
          chainName: NETWORK_NAME,
          nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
          rpcUrls: [AMOY_PUBLIC_RPC_URL],
          blockExplorerUrls: [BLOCK_EXPLORER_URL],
        }],
      })
    } else {
      throw switchError
    }
  }

  const confirmedChainId = await ethereum.request({ method: 'eth_chainId' })
  if (confirmedChainId.toLowerCase() !== EXPECTED_CHAIN_ID_HEX.toLowerCase()) {
    throw new Error(`Wrong network selected in MetaMask. Please switch to ${NETWORK_NAME} and try again.`)
  }
}

/**
 * Reads the deployed contract's on-chain issuer directly — this is the ground truth for who is
 * authorized to mint/revoke, and stays correct even if the issuer is ever rotated later via
 * setIssuer(), without needing a second hardcoded copy of the admin address in frontend config.
 * Read-only: uses a plain provider, no signer needed.
 */
async function getAuthorizedIssuerAddress(ethereum) {
  const provider = new ethers.BrowserProvider(ethereum)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
  const issuer = await contract.issuer()
  return issuer.toLowerCase()
}

/**
 * Ensures the MetaMask account currently active for this site is the contract's authorized
 * issuer. eth_requestAccounts only re-prompts the account picker on a site's very first
 * connection — once a site is already connected, MetaMask silently keeps using whatever account
 * was last active for it, even if that's the wrong one, and nothing was previously checking the
 * returned address against the required admin/issuer wallet. That's the root cause of the
 * mismatch: connectAdminWallet() accepted accounts[0] unconditionally.
 *
 * If the wrong account is active, this calls wallet_requestPermissions to force MetaMask to
 * re-show its account picker (there is no MetaMask API to silently force-select one specific
 * account — only the user can do that). It then re-reads eth_accounts and, if the active account
 * still doesn't match, throws a clear error and refuses to proceed — the transaction is never
 * signed by the wrong wallet.
 */
async function ensureCorrectAccount(ethereum) {
  const authorizedIssuer = await getAuthorizedIssuerAddress(ethereum)

  const readActive = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    return accounts?.[0]?.toLowerCase() ?? null
  }

  let active = await readActive()

  if (active !== authorizedIssuer) {
    try {
      await ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })
    } catch {
      // User dismissed the account picker — fall through, the check below produces the clear error.
    }
    active = await readActive()
  }

  if (active !== authorizedIssuer) {
    throw new Error(
      `Please connect the authorized admin wallet: ${authorizedIssuer}. MetaMask is currently using a different account.`
    )
  }
}

async function getSigner() {
  const ethereum = getEthereumProvider()
  await connectAdminWallet()
  await ensureCorrectNetwork()
  await ensureCorrectAccount(ethereum)
  const provider = new ethers.BrowserProvider(ethereum)
  return provider.getSigner()
}

/**
 * Subscribes to MetaMask's accountsChanged event so the UI can react (e.g. clear a stale
 * "wrong wallet" error) when the admin switches accounts. Returns an unsubscribe function; a
 * no-op if MetaMask isn't installed or doesn't support event subscriptions.
 */
export function onAccountsChanged(callback) {
  if (!window.ethereum?.on) {
    return () => {}
  }
  window.ethereum.on('accountsChanged', callback)
  return () => window.ethereum.removeListener?.('accountsChanged', callback)
}

/**
 * Best-effort search through ethers v6 / MetaMask's various nested error shapes for a human
 * revert reason string. Different failure paths populate different fields — a clean require()
 * revert usually gives error.reason or error.shortMessage, but some RPC providers return revert
 * data in a shape ethers can't fully parse, in which case ethers itself throws a low-level
 * "could not coalesce error" with none of the structured fields populated. This checks every
 * shape before ever falling back to the raw error.message, so that internal-ethers message is
 * only ever used as an absolute last resort (and toFriendlyError below filters it out even then).
 */
function extractRevertReason(error) {
  const candidates = [
    error?.reason,
    error?.shortMessage,
    error?.info?.error?.message,
    error?.error?.message,
    error?.error?.data?.message,
    error?.data?.message,
    typeof error?.data === 'string' ? error.data : null,
    error?.message,
  ]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate
    }
  }
  return ''
}

function isAlreadyMintedError(error) {
  return extractRevertReason(error).toLowerCase().includes('already minted')
}

/** Turns ethers/MetaMask's various error shapes into one readable sentence for the UI. */
function toFriendlyError(error) {
  const code = error?.code
  if (code === 'ACTION_REJECTED' || code === 4001) {
    return new Error('Transaction was rejected in MetaMask.')
  }
  const reason = extractRevertReason(error)
  // Ethers' own internal "could not coalesce error" (thrown when it can't parse an RPC
  // provider's error response) is not useful to show — it's not a revert reason, just ethers
  // giving up on normalizing the underlying error. Never surface it as if it were one.
  if (reason && !reason.toLowerCase().includes('could not coalesce')) {
    return new Error(reason.replace('execution reverted: ', ''))
  }
  return new Error('The blockchain transaction failed and no further detail was available from MetaMask or the RPC provider. Please try again.')
}

/** Pulls the token ID out of a mint receipt's CredentialIssued event log. */
function extractTokenIdFromReceipt(contract, receipt) {
  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog(log)
      if (parsed?.name === 'CredentialIssued') {
        return parsed.args.tokenId.toString()
      }
    } catch {
      // Not one of our contract's events (could be from another contract in the same block) — skip it.
    }
  }
  return null
}

/**
 * Read-only pre-check: is this certificateId already minted? Called BEFORE ever attempting a
 * transaction, so an already-minted certificate never gets a doomed-to-revert issueCredential()
 * sent at all. Returns the existing tokenId (string) if minted, otherwise null. If the read
 * itself fails (RPC hiccup), this does not throw — it returns null so the caller falls through
 * to a normal mint attempt, which still has its own already-minted recovery as a safety net.
 */
async function checkExistingTokenId(contract, certificateId) {
  try {
    const tokenId = await contract.certificateIdToTokenId(certificateId)
    return tokenId && tokenId !== 0n ? tokenId.toString() : null
  } catch (error) {
    console.warn('[blockchain] certificateIdToTokenId pre-check failed, proceeding with mint attempt', {
      certificateId,
      reason: extractRevertReason(error),
    })
    return null
  }
}

/**
 * Recovers an already-minted credential's on-chain record for a certificateId that the contract
 * says is already minted (certificateIdToTokenId != 0), but that this app never got to record
 * against the certificate row — e.g. an earlier attempt where the mint transaction succeeded but
 * the follow-up backend verification call failed for an unrelated reason (RPC/config issue,
 * network blip) before the certificate could be marked MINTED. Read-only: looks up the existing
 * tokenId (unless already known), then finds that mint's original transaction hash from its
 * CredentialIssued event log. Never sends a transaction.
 */
async function recoverExistingMint(contract, certificateId, knownTokenId) {
  let tokenId = knownTokenId
  if (tokenId === undefined || tokenId === null) {
    try {
      const raw = await contract.certificateIdToTokenId(certificateId)
      if (!raw || raw === 0n) {
        throw new Error('not minted')
      }
      tokenId = raw.toString()
    } catch (error) {
      throw new Error(
        'This certificate is already minted on-chain, but its token ID could not be read from the ' +
          'contract right now. Please try again in a moment.',
        { cause: error }
      )
    }
  }

  // Thrown when the tokenId is confirmed (certificateIdToTokenId != 0 — this certificate is
  // definitely already minted) but the transaction hash itself couldn't be found automatically.
  // Tagged with a `code` plus the already-confirmed tokenId/contractAddress so the caller can
  // offer a manual-reconciliation path (e.g. pasting the hash from a block explorer) instead of
  // treating this as a dead end — the mint is real, only the auto-lookup failed.
  function needsManualTxHash(cause) {
    const err = new Error(
      `This certificate is already minted on-chain (token ID ${tokenId}), but the transaction hash could ` +
        "not be recovered automatically from the contract's event history — the RPC provider may not " +
        'support looking up past events. If the transaction hash is already known (e.g. from the block ' +
        'explorer), it can be entered manually to finish recording this certificate as minted.',
      cause ? { cause } : undefined
    )
    err.code = 'ALREADY_MINTED_NEEDS_TX_HASH'
    err.tokenId = tokenId
    err.contractAddress = CONTRACT_ADDRESS
    return err
  }

  let events
  try {
    events = await contract.queryFilter(contract.filters.CredentialIssued(tokenId))
  } catch (error) {
    // Some RPC providers (especially free/public ones) limit or reject queryFilter's block-range
    // eth_getLogs call — don't let that raw provider error (or ethers' "could not coalesce
    // error" while trying to parse it) surface as-is.
    console.error('[blockchain] queryFilter failed while recovering existing mint', {
      certificateId,
      tokenId,
      reason: extractRevertReason(error),
    })
    throw needsManualTxHash(error)
  }

  const original = events[0]
  if (!original) {
    throw needsManualTxHash()
  }

  console.info('[blockchain] recovered existing mint', {
    certificateId,
    tokenId,
    contractAddress: CONTRACT_ADDRESS,
    transactionHash: original.transactionHash,
  })

  return {
    transactionHash: original.transactionHash,
    tokenId,
    contractAddress: CONTRACT_ADDRESS,
  }
}

/**
 * Calls issueCredential() on-chain, signed and submitted by the admin's MetaMask. Returns the
 * transaction hash and the newly minted token ID (read from the CredentialIssued event in the
 * mined receipt) so the caller can report them to the backend for verification + storage.
 *
 * Checks certificateIdToTokenId() BEFORE sending any transaction. If the certificate is already
 * minted (a prior attempt succeeded on-chain but this certificate was never marked MINTED in the
 * database — most likely its backend verification step failed separately), this recovers the
 * existing mint's tokenId/txHash instead of sending another transaction, which the contract would
 * correctly reject anyway. A catch around the mint call is kept as a fallback in case the
 * pre-check itself couldn't run.
 */
export async function issueCredentialOnChain({ certificateId, certificateHash, studentWalletAddress }) {
  assertContractConfigured()
  try {
    const signer = await getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    const existingTokenId = await checkExistingTokenId(contract, certificateId)
    if (existingTokenId !== null) {
      console.info('[blockchain] certificate already minted, recovering existing record instead of minting again', {
        certificateId,
        tokenId: existingTokenId,
        contractAddress: CONTRACT_ADDRESS,
      })
      return await recoverExistingMint(contract, certificateId, existingTokenId)
    }

    let receipt
    try {
      const tx = await contract.issueCredential(certificateId, certificateHash, studentWalletAddress)
      receipt = await tx.wait()
    } catch (mintError) {
      if (!isAlreadyMintedError(mintError)) {
        throw mintError
      }
      return await recoverExistingMint(contract, certificateId)
    }

    const tokenId = extractTokenIdFromReceipt(contract, receipt)
    if (!tokenId) {
      throw new Error('Transaction succeeded but the CredentialIssued event was not found — cannot determine the token ID.')
    }

    console.info('[blockchain] mint succeeded', {
      certificateId,
      tokenId,
      contractAddress: CONTRACT_ADDRESS,
      transactionHash: receipt.hash,
    })

    return {
      transactionHash: receipt.hash,
      tokenId,
      contractAddress: CONTRACT_ADDRESS,
    }
  } catch (error) {
    console.error('[blockchain] issueCredentialOnChain failed', {
      certificateId,
      code: error?.code,
      reason: extractRevertReason(error),
    })
    // ALREADY_MINTED_NEEDS_TX_HASH (thrown by recoverExistingMint above) must reach the caller
    // intact — it carries tokenId/contractAddress the UI needs to offer manual reconciliation.
    // toFriendlyError() below builds a plain new Error for display purposes and would otherwise
    // silently strip that typed code and those fields.
    if (error?.code === 'ALREADY_MINTED_NEEDS_TX_HASH') {
      throw error
    }
    throw toFriendlyError(error)
  }
}

/** Calls revokeCredential() on-chain, signed and submitted by the admin's MetaMask. */
export async function revokeCredentialOnChain({ tokenId, reason }) {
  assertContractConfigured()
  try {
    const signer = await getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    const tx = await contract.revokeCredential(tokenId, reason)
    const receipt = await tx.wait()

    return { transactionHash: receipt.hash }
  } catch (error) {
    throw toFriendlyError(error)
  }
}
