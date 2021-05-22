import { SmartContract } from "../../src/entity/SmartContract";
import { createConnection } from "typeorm";
import { DefiApp } from "../../src/entity/DefiApp";


async function main(){
    console.log('addContract()')

    let connection = await createConnection();

    // let result =   connection.dropDatabase()
    // console.log(result)
    
    let appDepository = connection.getRepository(DefiApp)


    let contractDepository = connection.getRepository(SmartContract)

    let app = await  appDepository.findOne('MDEX')
    console.log('app:', app)

    if (!app){
        return console.error('not found')
    }

    let contract = new SmartContract();
    contract.defiApp = app
    contract.address = '0xb0b670fc1F7724119963018DB0BfA86aDb22d941'
    contract.name = 'MdexFactory'
    contract.desc = 'MdexFactory'

    let result = await contractDepository.save(contract)
    console.log(result)

    // let result2 = await appDepository.save(app);

    // console.log(result2)
}

main();