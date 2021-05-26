export function DelayMs (t:number):Promise<void>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve();
        },t)
    })
}

export async function getImportantContracts(name:string):Promise<void>{
    console.log('getImportantContracts()')
}