import "reflect-metadata";

import Koa from "koa";

import { createKoaServer, useContainer } from "routing-controllers";
import { Container, Service } from "typedi";

@Service()
export class App {
  private application: Koa;

  public constructor() {
    useContainer(Container);
    this.application = createKoaServer({
      routePrefix: "/api",
      cors: true,
      controllers: [__dirname + "/../app/controllers/**/*.controller.js"],
    });
  }

  public getApp(): Koa {
    return this.application;
  }
}
