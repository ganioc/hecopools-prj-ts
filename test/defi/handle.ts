import { Connection, createConnection, EntityTarget } from "typeorm";
import { DefiApp } from "../../src/entity/DefiApp";
import "reflect-metadata";
import { SmartContract } from "../../src/entity/SmartContract";
import { Pool } from "../../src/entity/Pool";
import { Pair } from "../../src/entity/Pair";
import * as yargs from 'yargs';
import { updatePair as updateBXHPair} from '../update/updatebxh'


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
async function updateDefaultPair(connection: Connection, name:string){
    let lowerCase = name.toLowerCase();

    if(lowerCase === 'bxh'){
        return updateBXHPair(connection, name)
    }

}
async function updateDefaultEntity<Type>(connection:Connection, target: EntityTarget<Type>, name:string){
    let nameTarget = getClassName(target)
    console.log('\nupdateDefaultEntity ', nameTarget, name)

    if(nameTarget === 'Pair'){
        await updateDefaultPair(connection, name);
    }else{
        console.error('Not support: ', nameTarget)
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
function getClassName<Type>(target: EntityTarget<Type>): string {
    // 
    return target.toString().split(' ')[1]
}
function getEntityByName<Type>(name: string): EntityTarget<Type> {
    let lowerCase = name.toLowerCase();

    if (lowerCase === 'defiapp') {
        return DefiApp;
    } else if (lowerCase === 'smartcontract') {
        return SmartContract;
    } else if (lowerCase === 'pool') {
        return Pool;
    } else if (lowerCase === 'pair') {
        return Pair;
    } else {
        throw new Error('Unknown: ' + name)
    }
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
async function handleUpdateDefaultEntity(connection:Connection, entity: string | unknown, name:string | unknown){
    await updateDefaultEntity(connection, getEntityByName(entity as string), name as string)
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
            name:{
                describe: 'DefiApp name',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            console.log('UpdateDefault ', argv.entity, argv.name)
            handleUpdateDefaultEntity(conn, argv.entity, argv.name)
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

    yargs.parse();

}
main()