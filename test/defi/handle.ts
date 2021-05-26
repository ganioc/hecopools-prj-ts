import { Connection, createConnection, EntityTarget } from "typeorm";
import { DefiApp } from "../../src/entity/DefiApp";
import "reflect-metadata";
import { SmartContract } from "../../src/entity/SmartContract";
import { Pool } from "../../src/entity/Pool";
import { Pair } from "../../src/entity/Pair";
import * as yargs from 'yargs';
import { describe } from "yargs";

async function toCreate(connection: Connection) {
    console.log('toCreate')
}
async function toAddApp(connection: Connection, name: string, url: string, desc: string) {
    console.log('toAddApp: ', name)
    let app = new DefiApp();
    app.name = name;
    app.url = url;
    app.desc = desc;
    let result = await connection.manager.save(app);
    console.log(result)
    console.log('toAddApp done.')
}
function getClassName<Type>(target: EntityTarget<Type>) {
    // 
    return target.toString().split(' ')[1]
}
async function readEntity<Type>(connection: Connection, target: EntityTarget<Type>, relationLst: string[]) {
    console.log('\nreadEntity: ', getClassName(target))
    const repository = connection.getRepository(target);
    const items = await repository.findAndCount({
        relations: relationLst
    })
    for (let item of items) {
        console.log(item)
    }
}
async function toRead(connection: Connection) {
    console.log('\ntoRead')
    const appDepository = connection.getRepository(DefiApp)
    const contractDepository = connection.getRepository(SmartContract)

    let apps = await appDepository.findAndCount({
        relations: ['contracts']
    });
    // console.log(apps)

    for (let app of apps) {
        console.log(app)
    }

    let contracts = await contractDepository.findAndCount({
        relations: ['defiApp']
    });
    // console.log(contracts)
    for (let contract of contracts) {
        console.log(contract)
    }
}
async function toAddContract(connection: Connection, appStr: string, address: string, desc: string, name: string) {
    console.log('\naddContract')
    const appRepos = connection.getRepository(DefiApp);
    const app = await appRepos.findOne(appStr)

    let contract = new SmartContract();
    contract.address = address
    contract.defiApp = app
    contract.desc = desc
    contract.name = name

    let result = await connection.manager.save(contract);
    console.log(result)

    console.log('addContract done.')
}
async function toFindContracts(connection: Connection, appstr: string) {
    console.log('\ntoFindContracts()')
    const app = await connection.getRepository(DefiApp)
        .findOne({
            relations: ['contracts'],
            where: { name: appstr }
        })
    console.log(app)
    // console.log(app.contracts)
    console.log('\ntoFindContracts() done.')
}

async function addApp(conn: Connection) {
    console.log("\naddApp")
    await toAddApp(conn, 'BXH', 'https://bxh.com', '笨小孩')
    await toAddApp(conn, 'BACK', 'https://back.finance/#/home', 'BACK')
    await toAddApp(conn, 'MDEX', 'https://mdex.com', 'DEX')

}

async function main() {
    console.log('defi mdex')
    const conn = await createConnection();



    // await toAddContract(conn, 'MDEX', '0xED7d5F38C79115ca12fe6C0041abb22F0A06C300','MdexRouter','MdexRouter')

    // await toAddContract(conn, 'BXH', '0x00eFB96dBFE641246E961b472C0C3fC472f6a694' ,'UniswapV2Router02','UniswapV2Router02')

    // await toAddContract(conn, 'BXH',
    // '0xe0367ec2bd4Ba22B1593E4fEFcB91D29DE6C512a',
    // 'UniswapV2Factory', 'UniswapV2Factory')

    // await toAddContract(conn, 'BACK',
    // '0x51b4fa29dA61715d3384Be9f8a7033bD349Ef629',
    // 'BackConfig','BackConfig')

    // await toAddContract(conn, 'BACK',
    // '0x3fcB7AF59a84d79F4Ce466E39e62183AC62C0059',
    // 'BackPairFactory','BackPairFactory')

    // await toAddContract(conn, 'BACK',
    // '0xCCE77dCbCDEcC43520144a030CA15B38f6711832',
    // 'BackPoolFactory','BackPoolFactory')


    // await toAddContract(conn, 'BACK',
    // '0xa2B27EaC08d1E792F2CE2d99C0331D0E495c4D80',
    // 'BackReward','BackReward')

    // await toFindContracts(conn, 'MDEX')

    // await toFindContracts(conn, 'BXH')

    // await toFindContracts(conn, 'BXH')

    // await toRead(conn)

    // await addApp(conn);



    // await readEntity(conn, DefiApp,["contracts", "pairs", "pools"]);
    // await readEntity(conn, SmartContract,[]);
    // await readEntity(conn, Pool, [])
    // await readEntity(conn, Pair, [])

    yargs.command({
        command: 'add',
        describe: 'Add command',
        builder: {
            first: {
                describe: 'First number',
                demandOption: true,
                type: 'number'
            }
        },
        handler(argv) {
            console.log('Add ', argv.first)
        }

    })

    yargs.parse();

}
main()