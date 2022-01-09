import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import "reflect-metadata";

const main = async () => {
  const orm = await MikroORM.init(microConfig); // connect to database
  await orm.getMigrator().up(); // run migrations

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Served started on localhost:4000.");
  });

  // const post = orm.em.create(Post, { title: "This is my first post" }); // creates a post
  // await orm.em.persistAndFlush(post); // insert post to database

  // const posts = await orm.em.find(Post, {});  // retrieve every post from the database
  // console.log(posts);
};

main().catch((err) => {
  console.error(err);
});
