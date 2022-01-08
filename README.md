# Initialize

**Node v16.13.1** is used, with **npm 8.1.2**. In order to call `yarn XXX`, we must enable corepack by executing `corepack enable`.

# Commands

## Primary

**`yarn watch`**: calls `tsc -w` (TypeScript compiler --watch), which allows for JavaScript translation when changes are detected. Generated JavaScript code is located in *`dist`* folder.

**`yarn dev`**: calls `nodemon dist/index.js`, which waits for changes to start `node dist/index.js`.

**`npx mikro-orm migration:create`**: creates a new migration file with current schema diff.

## Optional

**`yarn start`**: calls `node dist/index.js`, which compiles and executes the generated JavaScript code.

**`yarn start2`**: calls `ts-node src/index.ts`, which compiles and executes the TypeScript code.

# Milestones

- [X] Database setup with Mikro ORM
- [ ] GraphQL setup