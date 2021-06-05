import { Connection, createConnection, EntityTarget } from "typeorm";
import { DefiApp } from "../../entity/DefiApp";
import "reflect-metadata";
import { SmartContract } from "../../entity/SmartContract";
import * as yargs from 'yargs';
import { test as handleTest } from '../../../test/update/test'
import { handleUpdateDefaultEntity } from "./updateDefaultEntity";
import { getClassName, getEntityByName } from "../heco/common";
import { queryPairPriceByPage, queryPairPriceByTime } from "../db/db";

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
async function removeEntityByName<Type>(connection: Connection, target: EntityTarget<Type>, name: string) {
    console.log('\nremoveEntity: ', getClassName(target))
    await connection
        .createQueryBuilder()
        .delete()
        .from(target)
        .where("name = :name", { name: name })
        .execute()
}
async function addDefaultEntity<Type>(connection: Connection, target: EntityTarget<Type>) {
    let nameTarget = getClassName(target)
    console.log('\naddDefaultEntity: ', nameTarget)

    if (nameTarget === 'DefiApp') {
        await toAddApp(connection, 'BXH', 'https://bxh.com', '笨小孩')
        await toAddApp(connection, 'BACK', 'https://back.finance/#/home', 'BACK')
        await toAddApp(connection, 'MDEX', 'https://mdex.com', 'DEX')
    } else if (nameTarget === 'SmartContract') {

        await toAddContract(connection, 'MDEX', '0xED7d5F38C79115ca12fe6C0041abb22F0A06C300', 'MdexRouter', 'MdexRouter')

        await toAddContract(connection, 'BXH', '0x00eFB96dBFE641246E961b472C0C3fC472f6a694', 'UniswapV2Router02', 'UniswapV2Router02')

        await toAddContract(connection, 'BXH',
            '0xe0367ec2bd4Ba22B1593E4fEFcB91D29DE6C512a',
            'UniswapV2Factory', 'UniswapV2Factory')

        await toAddContract(connection, 'BACK',
            '0x51b4fa29dA61715d3384Be9f8a7033bD349Ef629',
            'BackConfig', 'BackConfig')

        await toAddContract(connection, 'BACK',
            '0x3fcB7AF59a84d79F4Ce466E39e62183AC62C0059',
            'BackPairFactory', 'BackPairFactory')

        await toAddContract(connection, 'BACK',
            '0xCCE77dCbCDEcC43520144a030CA15B38f6711832',
            'BackPoolFactory', 'BackPoolFactory')

        await toAddContract(connection, 'BACK',
            '0xa2B27EaC08d1E792F2CE2d99C0331D0E495c4D80',
            'BackReward', 'BackReward')
    }

    else {
        console.log('Not support: ', nameTarget)
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

function getRelationByName(name: string): string[] {
    let lowerCase = name.toLowerCase();

    if (lowerCase === 'defiapp') {
        return ['contracts', 'pairs', 'pools'];
    } else if (lowerCase === 'smartcontract') {
        return ['defiApp'];
    } else if (lowerCase === 'pool') {
        return [];
    } else if (lowerCase === 'pair') {
        return [];
    } else {
        throw new Error('Unknown: ' + name)
    }
}
async function handleReadEntity(connection: Connection, name: string | unknown) {
    await readEntity(connection, getEntityByName(name as string), getRelationByName(name as string))
}
async function handleRemoveEntityByName(connection: Connection, entityName: string | unknown, name: string | unknown) {
    await removeEntityByName(connection, getEntityByName(entityName as string), name as string)

    console.log('---- Done ----')
}
async function handleAddDefaultEntity(connection: Connection, entity: string | unknown) {
    await addDefaultEntity(connection, getEntityByName(entity as string))
}

async function handlePairPrice(poolname:string, symbol0:string, symbol1:string, index:number, pageSize:number){
    let pool =  poolname.toUpperCase();
    console.log()

    if(pool === 'BXH'){
        let result = await  queryPairPriceByPage(poolname, symbol0, symbol1, index, pageSize);
        console.log(result)
    }else if(pool === "MDEX"){
        console.error("Unhandled pool:", poolname)
    }else{
        console.error("Unknown pool:", poolname)
    }
}
async function handlePairPriceByTime(poolname:string, symbol0:string, symbol1:string, start:number, end:number){
    let pool =  poolname.toUpperCase();
    console.log()

    if(pool === 'BXH'){
        let result = await  queryPairPriceByTime(poolname, symbol0, symbol1, start, end);
        console.log(result)
    }else if(pool === "MDEX"){
        console.error("Unhandled pool:", poolname)
    }else{
        console.error("Unknown pool:", poolname)
    }
}

async function main() {
    // console.log('defi mdex')
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

    yargs.version('0.0.1')

    yargs.command({
        command: 'updateDefault',
        describe: 'Update default command',
        builder: {
            entity: {
                describe: 'Entity Name',
                demandOption: true,
                type: 'string'
            },
            name: {
                describe: 'DefiApp name',
                demandOption: true,
                type: 'string'
            },
            batch: {
                describe: 'parallel processing',
                demandOption: false,
                type: 'string'
            },
            start: {
                describe: 'start index',
                demandOption: false,
                type: 'number'
            }
        },
        handler(argv) {
            console.log('UpdateDefault ', argv.entity, argv.name)
            handleUpdateDefaultEntity(conn, argv.entity, argv.name, argv.batch, argv.start)
        }
    })

    yargs.command({
        command: 'addDefault',
        describe: 'Add default command',
        builder: {
            entity: {
                describe: 'Entity Name',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            console.log('Add ', argv.entity)
            handleAddDefaultEntity(conn, argv.entity)
        }

    })
    yargs.command({
        command: 'removeByName',
        describe: 'Remove command',
        builder: {
            entity: {
                describe: 'Entity name',
                demandOption: true,
                type: 'string'
            },
            name: {
                describe: 'name',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            console.log('Remove ', argv.entity)
            handleRemoveEntityByName(conn, argv.entity, argv.name)
        }

    })

    yargs.command({
        command: 'list',
        describe: 'List command',
        builder: {
            entity: {
                describe: 'Entity name',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            console.log('List ', argv.entity)
            handleReadEntity(conn, argv.entity);
        }

    })

    yargs.command({
        command: 'pairPrice',
        describe: 'pairPrice command',
        builder: {
            pool: {
                describe: 'pool name',
                demandOption: true,
                type: 'string'
            },
            symbol0:{
                describe: 'symbol0 name',
                demandOption: true,
                type: 'string'
            },
            symbol1:{
                describe: 'symbol1 name',
                demandOption: true,
                type: 'string'
            },
            index:{
                describe: 'page index',
                demandOption: true,
                type: 'number'
            },
            size:{
                describe: 'page size',
                demandOption: true,
                type: 'number'
            }
        },
        handler(argv) {
            console.log('List Pair Price', argv.pool)
            handlePairPrice(argv.pool as string, argv.symbol0 as string, argv.symbol1 as string, argv.index as number, argv.size as number);
            
        }
    })


    yargs.command({
        command: 'pairPriceByTime',
        describe: 'pairPriceByTime command',
        builder: {
            pool: {
                describe: 'pool name',
                demandOption: true,
                type: 'string'
            },
            symbol0:{
                describe: 'symbol0 name',
                demandOption: true,
                type: 'string'
            },
            symbol1:{
                describe: 'symbol1 name',
                demandOption: true,
                type: 'string'
            },
            start:{
                describe: 'start time',
                demandOption: true,
                type: 'number'
            },
            end:{
                describe: 'end time',
                demandOption: true,
                type: 'number'
            }
        },
        handler(argv) {
            console.log('List Pair Price', argv.pool)
            handlePairPriceByTime(argv.pool as string, argv.symbol0 as string, argv.symbol1 as string, argv.start as number, argv.end as number);
            
        }
    })

    yargs.command({
        command: 'test',
        describe: 'Test Token command',
        builder: {
            contract: {
                describe: 'Token contract name',
                demandOption: true,
                type: 'string'
            },
            name: {
                describe: 'defiapp name',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            console.log('Test ')
            handleTest(conn, argv.contract as string, argv.name as string);
        }

    })

    yargs.parse();

}
main()