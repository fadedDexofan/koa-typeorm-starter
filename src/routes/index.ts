import Router from "koa-router";

import * as authController from "../controllers/AuthController";
import * as userController from "../controllers/UserController";
import jwt from "../middlewares/jwt";

const router = new Router({ prefix: "/api" });

// Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/refresh-tokens", authController.refreshTokens);

// Users
router.get("/users/me", jwt, userController.profile);

export default router;
