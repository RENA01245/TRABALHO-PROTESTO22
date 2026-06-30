import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "funcionario@demo.com" },
    update: {},
    create: { name: "Funcionário Demo", email: "funcionario@demo.com", passwordHash, role: UserRole.FUNCIONARIO }
  });

  await prisma.user.upsert({
    where: { email: "chefe@demo.com" },
    update: {},
    create: { name: "Chefe Demo", email: "chefe@demo.com", passwordHash, role: UserRole.CHEFE }
  });

  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: { name: "Administrador Demo", email: "admin@demo.com", passwordHash, role: UserRole.ADMIN }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
