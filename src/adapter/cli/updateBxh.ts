import { ethers } from "ethers"
import { Connection } from "typeorm"
import { updateBatchPair } from "./common"
import { walletProvider} from "./common"
import V2FactoryAbi from "../../config/UniswapV2Factory.json"

const addrFactory = "0xe0367ec2bd4Ba22B1593E4fEFcB91D29DE6C512a"

export function getBxhFactoryContract(){
    return new ethers.Contract(addrFactory, V2FactoryAbi.abi, walletProvider)
}

export async function updateBatchBXHPair(connection: Connection, name: string, start: number){
    console.log('\nbatch processing')
    console.log('update mdex pair')

    await updateBatchPair(connection, name, start, getBxhFactoryContract())
}