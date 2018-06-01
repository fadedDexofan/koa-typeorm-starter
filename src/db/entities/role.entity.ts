import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn() public id?: number;

  @Column({ nullable: false, unique: true })
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}
