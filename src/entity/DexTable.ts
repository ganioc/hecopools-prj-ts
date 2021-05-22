import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DexTable{
    @PrimaryColumn()
    name:string;

    @Column()
    address:string

}