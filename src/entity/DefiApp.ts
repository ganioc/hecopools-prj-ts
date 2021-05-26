import { SmartContract } from "./SmartContract";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Pair } from "./Pair";
import { Pool } from "./Pool";

@Entity()
export class DefiApp {
    @PrimaryColumn({ unique: true })
    name: string;

    @Column()
    url: string;

    @Column()
    desc: string;

    @OneToMany(() => SmartContract, contract => contract.defiApp, {
        cascade: true
    })
    contracts: SmartContract[]

    @OneToMany(() => Pair, pair => pair.defiApp, { cascade: true })
    pairs: Pair[]

    @OneToMany(() => Pool, pool => pool.defiApp, { cascade: true })
    pools: Pool[]

}