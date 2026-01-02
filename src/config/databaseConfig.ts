import { PrismaPg } from "@prisma/adapter-pg";
import { BCRYPT_SALT_ROUNDS, DATABASE_URL, NODE_ENV } from "./serverConfig";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";
import logger from "./loggerConfig";

const connectionString = DATABASE_URL;

console.log(DATABASE_URL)

const adapter = new PrismaPg({ connectionString });

const basePrisma = new PrismaClient({
  adapter,
  log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["info"],
});

interface UserData {
  password?: string;
  [key: string]: any;
}

const SALT_ROUNDS = parseInt(BCRYPT_SALT_ROUNDS, 10);

const hashUserPassword = async (data: UserData): Promise<void> => {
  if (data && data.password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    data.password = await bcrypt.hash(data.password, salt);
  }
};

const prisma = basePrisma.$extends({
  query: {
    user: {
      async create({ args, query }) {
        await hashUserPassword(args.data);
        return query(args);
      },
      async update({ args, query }: any) {
        await hashUserPassword(args.data);
        return query(args);
      },
    },
  },
});

function shutDownHandler(signal: string) {
  return async () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    await prisma.$disconnect();
    logger.info(`Database connection closed.`);
    process.exit(0);
  };
}

process.on("SIGINT", shutDownHandler("SIGINT"));
process.on("SIGTERM", shutDownHandler("SIGTERM"));

export default prisma;
