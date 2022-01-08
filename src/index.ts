import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(microConfig); // connect to database
  await orm.getMigrator().up(); // run migrations

  // const post = orm.em.create(Post, { title: "This is my first post" }); // creates a post
  // await orm.em.persistAndFlush(post); // insert post to database

  // const posts = await orm.em.find(Post, {});  // retrieve every post from the database
  // console.log(posts);
};

main().catch((err) => {
  console.error(err);
});
