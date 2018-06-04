import "reflect-metadata";
import { Container, Service } from "typedi";
import {
  Connection,
  createConnection,
  useContainer as ormUseContainer,
} from "typeorm";

import { ConnectionSecure } from "../decorators/ConnectionSecure";
import { IDatabase } from "../libs/IDatabase";

@Service()
@ConnectionSecure(["connect"])
export class Database implements IDatabase {
  private connection: Connection;

  public async connect(): Promise<Connection> {
    if (this.connection) {
      await this.connection.connect();
      return this.connection;
    }
    ormUseContainer(Container);
    this.connection = await createConnection();
    return this.connection;
  }

  public async disconnect(): Promise<void> {
    if (this.connection.isConnected) {
      await this.connection.close();
    }
  }

  public async executeSQL(sql: string, ...params: any[]): Promise<any> {
    return this.connection.createQueryRunner().query(sql, params);
  }

  public async reset() {
    await this.connection.dropDatabase();
    await this.connection.runMigrations();
  }

  public async runMigrations() {
    await this.connection.runMigrations();
  }

  public async dropDatabase() {
    await this.connection.dropDatabase();
  }
}
