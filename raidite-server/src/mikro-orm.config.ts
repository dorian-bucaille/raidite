import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import dotenv from "dotenv";
import { User } from "./entities/User";

dotenv.config(); // retrieves keys and values defined in the .env file

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  entities: [Post, User],
  dbName: "raidite",
  type: "postgresql",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  debug: !__prod__, // debugs only when not in production
} as Parameters<typeof MikroORM.init>[0];
// as Parameters<typeof MikroORM.init>[0] allows for autocompletion according to MikroORM.init() fields.
