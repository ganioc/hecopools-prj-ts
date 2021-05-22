import { createConnection } from "typeorm";
import { DefiApp } from "../../src/entity/DefiApp";
import "reflect-metadata";
import { SmartContract } from "../../src/entity/SmartContract";


 async function main(){
    console.log('defi mdex')
    const connection = await createConnection(); 

    // await connection.synchronize()

    const appDepository = connection.getRepository(DefiApp)
    const contractDepository = connection.getRepository(SmartContract)

    let apps = await appDepository.findAndCount();
    console.log(apps)

    let app1 = await appDepository.findOne('MDEX')
    console.log(app1.contracts)

    let contracts = await contractDepository.findAndCount();
    console.log(contracts)

    let app = new DefiApp();
    app.name = 'MDEX'
    app.url = 'https://mdex.com/'
    app.descr = 'DEX'
    // app.name = 'BXH'
    // app.url = 'https://bxh.com'
    // app.descr = 'DEX'

    // let result = await appDepository.save(app);
    // console.log(result)
}
main()