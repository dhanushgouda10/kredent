require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

// AMOY_RPC_URL: an RPC endpoint for Polygon Amoy, chain ID 80002 (e.g. your Alchemy/Infura
// Polygon Amoy URL, or the public https://rpc-amoy.polygon.technology). Not secret by itself,
// but kept in .env anyway so it's easy to change per-environment without editing this file.
//
// DEPLOYER_PRIVATE_KEY: the private key of whichever testnet wallet deploys the contract (a
// throwaway MetaMask test account funded with free Amoy POL from a faucet — see
// blockchain/README.md). This key is used ONLY by this Hardhat CLI, ONLY at deploy time, ONLY
// on your own machine. It is never read by the backend or frontend, never logged, and must
// never be committed — .env is gitignored. It is never hardcoded here, only read from env.
const { AMOY_RPC_URL, DEPLOYER_PRIVATE_KEY } = process.env

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    amoy: {
      url: AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology',
      chainId: 80002,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
    },
  },
}
