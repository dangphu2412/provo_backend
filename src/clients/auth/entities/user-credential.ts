import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserCredential {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  name: string;
}
