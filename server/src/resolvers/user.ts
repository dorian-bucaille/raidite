import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // User is not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { _id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length < 3) {
      return {
        errors: [
          {
            field: "username",
            message: "Username length must be greater than 2.",
          },
        ],
      };
    }

    if (options.password.length < 9) {
      return {
        errors: [
          {
            field: "password",
            message: "Password length must be greater than 8.",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password); // hash the plain password using argon2
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      user = result[0];
    } catch (err) {
      // If duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "Username already taken.",
            },
          ],
        };
      }
      console.log("Error: ", err.message);
    }

    // Store user session with a cookie (thus keeping them logged in)
    req.session!.userId = user._id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    // Check if the user exists
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "This username does not exist.",
          },
        ],
      };
    }

    // Verify that the typed password is correct
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password.",
          },
        ],
      };
    }

    // Store user session with a cookie
    // What's happenning :
    // 1. sess:auopifdqjahoiphf -> { userId: 1 } : store the session string into redis
    // 2. express-session signs a cookie and sets it for my browser pouerajflqshoahfsqh
    // 3. Whenever a request is made : pouerajflqshoahfsqh -> sent to the server
    // 4. pouerajflqshoahfsqh -> sess:auopifdqjahoiphf : express-session decrypts the browser cookie using COOKIE_SECRET
    // 5. Make the request to redis : sess:auopifdqjahoiphf -> { userId: 1 }
    req.session!.userId = user._id;

    return { user };
  }
}
