import { Connection, createConnection } from "typeorm";
import { DefiApp } from "../../src/entity/DefiApp";
import "reflect-metadata";
import { SmartContract } from "../../src/entity/SmartContract";

async function toCreate(connection: Connection) {
    console.log('toCreate')
}
async function toRead(connection: Connection){
    console.log('toRead')
    const appDepository = connection.getRepository(DefiApp)
    const contractDepository = connection.getRepository(SmartContract)

    let apps = await appDepository.findAndCount({
        relations:['contracts']
    });
    console.log(apps)
    for(let app of apps){
        console.log(app)
    }

    let contracts = await contractDepository.findAndCount({
        relations:['defiApp']
    });
    console.log(contracts)
    for(let contract of contracts){
        console.log(contract)
    }
}
async function main() {
    console.log('defi mdex')
    const connection = await createConnection();

    toRead(connection)
}
main()