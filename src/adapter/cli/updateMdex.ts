import { ethers } from "ethers"
import { Connection } from "typeorm"
import { updateBatchPair, walletProvider } from "./common"
import MdexFactoryAbi from '../../config/IMdexFactory.json'

const addrFactory = "0xb0b670fc1F7724119963018DB0BfA86aDb22d941"

export function getMdxFactoryContract(){
    return new ethers.Contract(addrFactory, MdexFactoryAbi.abi, walletProvider)
}

export async function updateBatchMDEXPair(connection: Connection, name: string, start: number) {
    console.log('\nbatch processing')
    console.log('update mdex pair')

    await updateBatchPair(connection, name, start, getMdxFactoryContract())
}