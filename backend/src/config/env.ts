import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3333),
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(",").map((origin) => origin.trim()),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret"
};
