import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  sayHello() {
    return 'Hello World!';
  }
}
