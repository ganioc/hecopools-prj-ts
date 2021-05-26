import { ethers } from 'ethers';
import { Connection, createConnection } from 'typeorm'
import { createDefiApp, readDefiApp } from '../../src/adapter/DefiAppFactory';
import PRECONFIG from '../../src/preconfig/all.json'
import configJson from "../../secret/config.json"
import {updatePair } from './updatebxh'


const chainUrl = "https://http-mainnet.hecochain.com"
const provider = new ethers.providers.JsonRpcProvider(chainUrl);
let walletProvider = new ethers.Wallet(configJson.secret, provider)

async function create(connection: Connection){
    console.log('Update all.')
    for(let app of PRECONFIG.defiApps){
        console.log('Update ', app.name)

        await createDefiApp(connection,app)
    }
}
async function read(connection: Connection){
    console.log('Read out all.')
    for(let app of PRECONFIG.defiApps){
        console.log('Read ', app.name)
        await readDefiApp(connection, app)
    }
}

async function main(){

    const connection = await createConnection();

    // await read(connection)
    await updatePair(connection, walletProvider)
}

main()