import { ethers } from "ethers";
import { Connection } from "typeorm";
import configJson from "../../secret/config.json"
import MdexFactoryAbi from '../../src/config/IMdexFactory.json'


const chainUrl = "https://http-mainnet.hecochain.com"
const provider = new ethers.providers.JsonRpcProvider(chainUrl);
let walletProvider = new ethers.Wallet(configJson.secret, provider)

const addrFactory = "0xb0b670fc1F7724119963018DB0BfA86aDb22d941"

export async function updatePair(connection :Connection, name:string) {
    console.log('update mdex pair')
    const contract = new ethers.Contract(addrFactory, MdexFactoryAbi.abi, walletProvider)
    let result = await contract.allPairsLength();

    let pairsLength = parseInt(result.toString())
    console.log('pairs length: ', pairsLength)


}