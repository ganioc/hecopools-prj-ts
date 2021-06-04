import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Anchor } from "./Anchor";

@Entity({name: 'price'})
export class Price{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: number;

    @Index()
    @Column()
    timestamp: number;

    @ManyToOne(()=> Anchor, anchor=>anchor.prices)
    anchor: Anchor
}

