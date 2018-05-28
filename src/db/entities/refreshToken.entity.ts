import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn() public id: number;
  @Column() public refreshToken: string;
  @ManyToOne((type) => User, (user) => user.refreshTokens)
  public user: User;
}
