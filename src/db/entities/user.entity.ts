import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Container } from "typedi";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BcryptService } from "../../services";
import { RefreshToken, Role } from "./";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid") public uuid?: string;
  @MinLength(6)
  @MaxLength(20)
  @Column({ unique: true })
  public username: string;
  @IsEmail()
  @Column({ unique: true })
  public email: string;
  @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  public refreshTokens?: RefreshToken[];
  @MinLength(8)
  @MaxLength(24)
  @Column({ type: "text", select: false })
  public password: string;

  @ManyToMany((type) => Role, { eager: true })
  @JoinTable({ name: "user_roles" })
  public roles: Role[];
  @CreateDateColumn() public createdAt?: Date;
  @UpdateDateColumn() public updatedAt?: Date;

  public async checkPassword(plainPassword: string): Promise<boolean> {
    const bcryptService = Container.get(BcryptService);
    const passwordIsCorrect = bcryptService.compareHash(
      plainPassword,
      this.password,
    );
    return passwordIsCorrect;
  }

  @BeforeInsert()
  private async _hashPassword?() {
    const bcryptService = Container.get(BcryptService);
    this.password = await bcryptService.hashString(this.password);
  }
}
