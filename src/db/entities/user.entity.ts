import * as bcrypt from "bcryptjs";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RefreshToken } from "./";
import { Role } from "./role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid") public uuid: string;
  @Column() public username: string;
  @Column() public email: string;
  @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  public refreshTokens: RefreshToken[];
  @Column() public password: string;

  @ManyToMany((type) => Role)
  @JoinTable({ name: "user_roles" })
  public roles: Role[];
  @CreateDateColumn() public createdAt: Date;
  @UpdateDateColumn() public updatedAt: Date;
  constructor(username: string, email: string, roles: Role[]) {
    this.username = username;
    this.email = email;
    this.roles = roles;
  }
}
