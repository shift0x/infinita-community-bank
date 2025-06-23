import { ethers } from "hardhat";
import { IERC20 } from "../../typechain-types";

export async function getState(account: any, bankToken: IERC20, sBankToken: IERC20, usdc : IERC20) {
    const usdcBalance = await usdc.balanceOf(account);
    const bankTokenBalance = await bankToken.balanceOf(account);
    const sBankTokenBalance = await sBankToken.balanceOf(account);

    return {
        usdcBalance: Number(ethers.formatEther(usdcBalance)),
        bankTokenBalance: Number(ethers.formatEther(bankTokenBalance)),
        sBankTokenBalance: Number(ethers.formatEther(sBankTokenBalance)),
    };
}

