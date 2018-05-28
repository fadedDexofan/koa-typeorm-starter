import { Connection } from "typeorm";

export interface IDatabase {
  connect(): Promise<Connection>;
  disconnect(): Promise<void>;
  executeSQL(sql: string, ...params: any[]): Promise<any>;
  reset(): any;
}
