import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { routes } from "./routes/index.js";
import { errorHandler } from "./middlewares/error.js";

export const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origem não permitida pelo CORS."));
  }
}));
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);
