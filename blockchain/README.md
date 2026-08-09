# SkillChain smart contract (Phase 3)

## Testnet: Sepolia

We use **Ethereum Sepolia** (chain ID `11155111`).

Why Sepolia specifically:
- It's the official Ethereum Foundation testnet recommended for dapp development (Goerli, the older one, was deprecated).
- MetaMask has it built in as a default test network — no manual network setup needed for most users, just enable "Show test networks" in MetaMask settings.
- Free faucets are actively maintained (unlike some older/abandoned testnets).
- It behaves like real Ethereum mainnet (same EVM, same gas model), so what works here works on mainnet later if this project ever needed to go further — nothing about the contract is testnet-specific.

## Getting a funded testnet admin account

1. In MetaMask, create (or use an existing) account — this becomes your admin wallet. Note its address.
2. Switch MetaMask to the Sepolia network (Settings → Show test networks → Sepolia).
3. Get free Sepolia ETH from a faucet (only need a small amount — gas on testnet is free-market but cheap):
   - https://www.alchemy.com/faucets/ethereum-sepolia (Alchemy account required, generous amount)
   - https://cloud.google.com/application/web3/faucet/ethereum/sepolia (Google account required)
   - https://sepoliafaucet.com
4. Confirm the funds arrived by checking the account in MetaMask (should show a small ETH balance).

This same funded account should be used both as the **deployer** (to deploy the contract, becoming its on-chain `issuer`) and as the **admin login wallet** (`ADMIN_WALLET_ADDRESS` in the backend) — so the one MetaMask account that logs into the Admin Portal is also the one authorized to mint/revoke credentials on-chain.

## Deploying

```bash
cd blockchain
npm install
cp .env.example .env
# edit .env: paste your funded test account's private key into DEPLOYER_PRIVATE_KEY
# (MetaMask: Account Details -> Show Private Key. Only ever do this for a
# throwaway testnet account, never a real one.)
npm run compile
npm run deploy:sepolia
```

The deploy script prints the deployed contract address and the on-chain issuer address. Copy the contract address into:
- `backend/.env` (or your env config) as `SMART_CONTRACT_ADDRESS`
- `frontend/.env` as `VITE_CONTRACT_ADDRESS`

Then delete `DEPLOYER_PRIVATE_KEY` from `blockchain/.env` if you like — it's not needed again unless you redeploy. It is never read by the backend or frontend at runtime.

## Why the backend never needs a blockchain private key

The admin's MetaMask signs the `issueCredential` / `revokeCredential` transactions directly from the browser (see `frontend/src/services/blockchainService.js`), using `ethers.js` against `window.ethereum`. The backend only ever reads the resulting transaction hash back from the RPC (read-only) to confirm it really succeeded, hit this exact contract, and came from the authorized admin address — see `backend/.../service/BlockchainVerificationService.java`. There is no `BLOCKCHAIN_PRIVATE_KEY` used by the running backend or frontend application; the only private key that ever exists outside MetaMask/the browser is the one-time deployer key above, and each student's system-managed wallet key, which is generated and AES-encrypted server-side and never leaves the backend (see `WalletService.java`).
