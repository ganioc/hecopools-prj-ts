import { Connection, EntityTarget } from "typeorm"
import { getClassName, getEntityByName } from "../heco/common";
import { updateBatchBXHPair } from "./updateBxh";
import { updateBatchMDEXPair } from "./updateMdex";



export async function updateBatchDefaultPair(connection: Connection, name:string, start: number){
    let lowerCase = name.toLowerCase();

    if(lowerCase === 'bxh'){
        return updateBatchBXHPair(connection, name, start)
    }else if(lowerCase === 'mdex'){
        return updateBatchMDEXPair(connection, name, start)
    }else{
        console.error('Unsupport ', name)
    }

}
export async function updateBatchDefaultEntity<Type>(connection:Connection, target: EntityTarget<Type>, name:string, start){
    let nameTarget = getClassName(target)
    console.log('\nupdateBatchDefaultEntity ', nameTarget, name)

    if(nameTarget === 'Pair'){
        await updateBatchDefaultPair(connection, name, start);
    }else{
        console.error('Not support: ', nameTarget)
    }
}
/**
 * Update Entity by default mode.
 * @param connection 
 * @param entity 
 * @param name 
 * @param batch 
 * @param start 
 */
export async function handleUpdateDefaultEntity(connection:Connection, entity: string | unknown, name:string | unknown, batch: string | unknown, start:number | unknown){

    if(batch && batch === '1'){
        await updateBatchDefaultEntity(connection, getEntityByName(entity as string), name as string, start as number)
    }else{
        // await updateDefaultEntity(connection, getEntityByName(entity as string), name as string)
        console.error('Unknown arguments.')
    }
}