// lp token

import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { DefiApp } from "./DefiApp";


@Entity({ name: 'pool' })
export class Pool {
    @PrimaryColumn()
    lpToken: string; // address of LP token contract

    @Column()
    tokenA: string;

    @Column()
    tokenB: string;

    @Column()
    allocPoint: number;

    @Column()
    lastRewardBlock: number;

    @Column()
    accTokenPerShare: number;

    @Column()
    accMultLpPerShare: number;

    @Column()
    totalAmount: number;

    @ManyToOne(() => DefiApp, defiApp => defiApp.pools)
    defiApp: DefiApp
}