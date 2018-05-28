import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn() public id: number;

  @Column("text") public name: string;

  constructor(name: string) {
    this.name = name;
  }
}
