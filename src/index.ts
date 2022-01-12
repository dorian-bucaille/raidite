import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import "reflect-metadata";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const main = async () => {
  const orm = await MikroORM.init(microConfig); // connect to database
  await orm.getMigrator().up(); // run migrations

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(); // uses defaults unless given configuration object

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https (in production)
      },
      saveUninitialized: false,
      secret:
        process.env.COOKIE_SECRET || "amlkfdsqhoipvqlfheabfkldsqfiuhqsdfkjl",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: { "request.credentials": "include" },
      }),
    ],
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
