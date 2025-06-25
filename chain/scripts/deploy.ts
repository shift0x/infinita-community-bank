import hre from "hardhat";

const DEAD_ADDRESS = "0x0000000000000000000000000000000000000000"

async function deploy(){
    const [deployer] = await hre.ethers.getSigners();

    const mintableTokenContract = await hre.ethers.getContractFactory("MintableToken");
    const usdc = await mintableTokenContract.deploy(DEAD_ADDRESS, "USDC", "USDC");
    
    await usdc.waitForDeployment();

    const bankContract = await hre.ethers.getContractFactory("BankVault");
    const bank = await bankContract.deploy(usdc, DEAD_ADDRESS);

    await bank.waitForDeployment();

    const bankAddress = await bank.getAddress();
    const usdcAddress = await usdc.getAddress();
    const loanVaultAddress = await bank.loanVault();
    const bankTokenAddress = await bank.BANK();
    const sBankTokenAddress = await bank.sBANK();

    console.log(`usdc: ${usdcAddress}`);
    console.log(`bank: ${bankAddress}`);
    console.log(`loan vault: ${loanVaultAddress}`);
    console.log(`bank token: ${bankTokenAddress}`);
    console.log(`sBank token: ${sBankTokenAddress}`);
}

deploy().then(() => { process.exit(); })