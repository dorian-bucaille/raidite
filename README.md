# Purpose

This educational project's goal is to create a fullstack functional clone of [Reddit](www.reddit.com) using the following technologies:
- React
- TypeScript
- GraphQL
- Apollo
- Node.js
- PostgreSQL
- MikroORM / TypeORM
- Redis
- Next.js
- TypeGraphQL
- Chakra

The tutorial I'm following to create this work can be found [here](https://youtu.be/I6ypD7qv3Z8). Shoutout to [Ben Awad](https://github.com/benawad) for making learning web dev a fun and interesting task!
# Setup

**Node v16.13.1** is used, with **npm 8.1.2**. In order to call `yarn XXX`, we must enable corepack by executing `corepack enable`.

# Commands

## Primary

**`yarn watch`**: calls `tsc -w` (TypeScript compiler --watch), which allows for JavaScript translation when changes are detected. Generated JavaScript code is located in *`dist`* folder.

**`yarn dev`**: calls `nodemon dist/index.js`, which waits for changes to start `node dist/index.js`.

**`npx mikro-orm migration:create`**: creates a new migration file with current schema diff.

**`brew services start redis`**: starts the redis client (MacOS).

## Secondary

**`yarn start`**: calls `node dist/index.js`, which compiles and executes the generated JavaScript code.

**`yarn start2`**: calls `ts-node src/index.ts`, which compiles and executes the TypeScript code.

**`yarn create:migration`**: calls `mikro-orm migration:create`, which creates migrations corresponding to our entities.

# Milestones

- [X] Database setup with Mikro ORM
- [X] Apollo GraphQL setup
- [X] Authentication setup
- [X] User session setup
- [X] Front end initialization
- [X] Register page
- [X] Front/back linking for registration