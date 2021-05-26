import { ethers } from 'ethers';
import configJson from "../secret/config.json"
import V2RouterAbi from "../src/config/IUniswapV2Router02.json"
import V2FactoryAbi from "../src/config/UniswapV2Factory.json"
console.log("Test:")

const chainUrl = "https://http-mainnet.hecochain.com"
const addrRouterv2 = "0x00eFB96dBFE641246E961b472C0C3fC472f6a694"
const addrFactory = "0xe0367ec2bd4Ba22B1593E4fEFcB91D29DE6C512a"

const provider = new ethers.providers.JsonRpcProvider(chainUrl);

let walletProvider = new ethers.Wallet(configJson.secret, provider)


async function loopRouter(){
    console.log("\nCheck v2Router contract:")

    let contract = new ethers.Contract(addrRouterv2, V2RouterAbi.abi, walletProvider)
    let result = await contract.factory();
    console.log("factory: ", result)

    result = await contract.WHT();
    console.log("WHT:", result)
}
async function loopFactory() {
    console.log("\nCheck v2Factory contract:")
    let contract = new ethers.Contract(addrFactory, V2FactoryAbi.abi, walletProvider)

    let result = await contract.feeTo();
    console.log("feeTo: ", result)
    result = await contract.feeToSetter();
    console.log("feeToSetter: ", result) 
    result = await contract.migrator();
    console.log("migrator: ", result)
    result = await contract.allPairsLength();
    console.log("allpairsLength: ", result.toString())

    let pairsLength = parseInt(result.toString())
    for(let i=0; i< pairsLength; i++){
        result = await contract.allPairs(i);
        console.log(result)
    }
}

async function main() {
    await loopRouter();
    await loopFactory()
}

main()

