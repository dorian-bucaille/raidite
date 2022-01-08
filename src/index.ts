import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(microConfig); // connect to database
  await orm.getMigrator().up(); // run migrations
  const post = orm.em.create(Post, { title: "This is my first post" }); // creates a post
  await orm.em.persistAndFlush(post); // insert post to database
};

main().catch((err) => {
  console.error(err);
});
