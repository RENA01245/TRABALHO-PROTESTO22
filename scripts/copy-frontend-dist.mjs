import { cp, rm } from "node:fs/promises";

await rm("dist", { force: true, recursive: true });
await cp("frontend/dist", "dist", { recursive: true });
