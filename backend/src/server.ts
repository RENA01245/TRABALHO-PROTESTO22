import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { routes } from "./routes/index.js";
import { errorHandler } from "./middlewares/error.js";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API disponível em http://localhost:${env.port}`);
});
