import "reflect-metadata";

import Koa from "koa";

import { createKoaServer, useContainer } from "routing-controllers";
import { Container, Service } from "typedi";
import { authorizationChecker } from "./middlewares/authorizationChecker.middleware";
import { currentUserChecker } from "./middlewares/currentUserChecker.middleware";

@Service()
export class App {
  private application: Koa;

  public constructor() {
    useContainer(Container);
    this.application = createKoaServer({
      routePrefix: "/api",
      cors: true,
      controllers: [__dirname + "/../app/controllers/**/*.controller.js"],
      middlewares: [__dirname + "/../app/middlewares/**/*.middleware.js"],
      authorizationChecker,
      currentUserChecker,
    });
  }

  public getApp(): Koa {
    return this.application;
  }
}
