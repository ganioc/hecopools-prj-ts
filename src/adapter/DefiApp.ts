export interface IfContract{
    address: string;
    name: string;
    desc: string;
}

export interface IfDefiAppOption{
    name: string;
    url: string;
    desc: string;
    contracts:IfContract[]
}


export class DefiApp {
    private name: string;
    constructor(option:IfDefiAppOption){
        this.name = option.name;
    }
}