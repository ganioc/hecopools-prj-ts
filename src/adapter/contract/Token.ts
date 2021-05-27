import { ethers } from "ethers";
import ERC20TokenAbi from '../../config/ERC20Token.json'

async function getTokenBasic(tokenAddr: string, wallet: ethers.Wallet, apiName:string) :Promise<string>{
    const contract = new ethers.Contract(tokenAddr, ERC20TokenAbi.abi, wallet)
    try{
        return await contract[apiName]();
    }catch(e){
        console.log(e)
        return ""
    }
}

export async function getTokenSymbol(tokenAddr: string, wallet: ethers.Wallet):Promise<string>{
//     const contract = new ethers.Contract(tokenAddr, ERC20TokenAbi.abi, wallet)

//    return contract.symbol();
    return getTokenBasic(tokenAddr, wallet, 'symbol')
}

export async function getTokenDecimals(tokenAddr: string, wallet: ethers.Wallet) :Promise<string>{
    // const contract = new ethers.Contract(tokenAddr, ERC20TokenAbi.abi, wallet)

    // return contract.decimals();
    return getTokenBasic(tokenAddr, wallet, 'decimals')
}

export async function getTokenName(tokenAddr: string, wallet: ethers.Wallet) :Promise<string>{
    return getTokenBasic(tokenAddr, wallet, 'name')
}
export async function getTokenTotalSupply(tokenAddr: string, wallet: ethers.Wallet) :Promise<string>{
    return getTokenBasic(tokenAddr, wallet, 'totalSupply')
}