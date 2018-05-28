import jwt = require("koa-jwt");

const JWT_SECRET: string = process.env.JWT_SECRET || "changemeinenv";

export default jwt({ secret: JWT_SECRET, algorithms: ["HS512"] });
