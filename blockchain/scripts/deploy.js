   console.log("RPC:", process.env.AMOY_RPC_URL);
   console.log("KEY loaded:", !!process.env.DEPLOYER_PRIVATE_KEY);



const hre = require('hardhat')

async function main() {
  const Contract = await hre.ethers.getContractFactory('SkillChainCredential')
  const contract = await Contract.deploy()
  await contract.waitForDeployment()

  const address = await contract.getAddress()
  const issuer = await contract.issuer()

  console.log('SkillChainCredential deployed to:', address)
  console.log('On-chain issuer (this becomes your BLOCKCHAIN_ADMIN_WALLET_ADDRESS):', issuer)
  console.log('')
  console.log('Next steps:')
  console.log('1. Put this address in backend .env as SMART_CONTRACT_ADDRESS')
  console.log('2. Put this address in frontend .env as VITE_CONTRACT_ADDRESS')
  console.log('3. Make sure the deployer address above matches ADMIN_WALLET_ADDRESS')
  console.log('   (the same admin wallet used to log into the Admin Portal)')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
