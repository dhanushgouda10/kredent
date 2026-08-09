import { ethers } from 'ethers'
import { CONTRACT_ABI, CONTRACT_ADDRESS, EXPECTED_CHAIN_ID_HEX, NETWORK_NAME } from '../contracts/skillChainConfig'

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

/** Throws a clear error if MetaMask is currently pointed at the wrong network. */
async function ensureCorrectNetwork() {
  const ethereum = getEthereumProvider()
  const chainId = await ethereum.request({ method: 'eth_chainId' })
  if (chainId.toLowerCase() !== EXPECTED_CHAIN_ID_HEX.toLowerCase()) {
    throw new Error(`Wrong network selected in MetaMask. Please switch to ${NETWORK_NAME} and try again.`)
  }
}

async function getSigner() {
  const ethereum = getEthereumProvider()
  await connectAdminWallet()
  await ensureCorrectNetwork()
  const provider = new ethers.BrowserProvider(ethereum)
  return provider.getSigner()
}

/** Turns ethers/MetaMask's various error shapes into one readable sentence for the UI. */
function toFriendlyError(error) {
  const code = error?.code
  if (code === 'ACTION_REJECTED' || code === 4001) {
    return new Error('Transaction was rejected in MetaMask.')
  }
  // Contract require() revert reasons surface differently across ethers versions.
  const reason = error?.reason || error?.shortMessage || error?.info?.error?.message
  if (reason) {
    return new Error(reason.replace('execution reverted: ', ''))
  }
  if (error?.message) {
    return new Error(error.message)
  }
  return new Error('The blockchain transaction failed. Please try again.')
}

/**
 * Calls issueCredential() on-chain, signed and submitted by the admin's MetaMask. Returns the
 * transaction hash and the newly minted token ID (read from the CredentialIssued event in the
 * mined receipt) so the caller can report them to the backend for verification + storage.
 */
export async function issueCredentialOnChain({ certificateId, certificateHash, studentWalletAddress }) {
  assertContractConfigured()
  try {
    const signer = await getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    const tx = await contract.issueCredential(certificateId, certificateHash, studentWalletAddress)
    const receipt = await tx.wait()

    let tokenId = null
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log)
        if (parsed?.name === 'CredentialIssued') {
          tokenId = parsed.args.tokenId.toString()
          break
        }
      } catch {
        // Not one of our contract's events (could be from another contract in the same block) — skip it.
      }
    }

    if (!tokenId) {
      throw new Error('Transaction succeeded but the CredentialIssued event was not found — cannot determine the token ID.')
    }

    return {
      transactionHash: receipt.hash,
      tokenId,
      contractAddress: CONTRACT_ADDRESS,
    }
  } catch (error) {
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
