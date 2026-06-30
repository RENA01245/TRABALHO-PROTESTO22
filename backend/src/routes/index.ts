import { Router } from "express";
import { authRouter } from "../modules/auth.js";
import { boletosRouter } from "../modules/boletos.js";
import { dashboardRouter } from "../modules/dashboard.js";
import { importsRouter } from "../modules/imports.js";
import { protestsRouter } from "../modules/protests.js";
import { reportsRouter } from "../modules/reports.js";
import { usersRouter } from "../modules/users.js";

export const routes = Router();

routes.get("/health", (_req, res) => res.json({ ok: true }));
routes.use("/auth", authRouter);
routes.use("/dashboard", dashboardRouter);
routes.use("/imports", importsRouter);
routes.use("/protests", protestsRouter);
routes.use("/boletos", boletosRouter);
routes.use("/reports", reportsRouter);
routes.use("/users", usersRouter);
