import "dotenv/config";

const configuredOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

export const env = {
  port: Number(process.env.PORT ?? 3333),
  corsOrigins: vercelOrigin ? [...configuredOrigins, vercelOrigin] : configuredOrigins,
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret"
};
