import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question";

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @ManyToMany(type=>Question, question => question.categories)
    questions:Question[];
}