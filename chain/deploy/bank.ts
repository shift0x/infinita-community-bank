import hre from "hardhat";

const DEAD_ADDRESS = "0x0000000000000000000000000000000000000000"

async function deploy(){
    const [deployer] = await hre.ethers.getSigners();

    const mintableTokenContract = await hre.ethers.getContractFactory("MintableToken");
    const usdc = await mintableTokenContract.deploy(DEAD_ADDRESS, "USDC", "USDC");
    
    await usdc.waitForDeployment();

    const bankContract = await hre.ethers.getContractFactory("BankVault");
    const bank = await bankContract.deploy(usdc, deployer);

    await bank.waitForDeployment();

    const bankAddress = await bank.getAddress();
    const usdcAddress = await usdc.getAddress();

    console.log(`deployed usdc test token: ${usdcAddress}`);
    console.log(`deployed bank contract: ${bankAddress}`);
}

deploy().then(() => { process.exit(); })