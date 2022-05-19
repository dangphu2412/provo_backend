import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DefinitionType {
  @Field({ nullable: true })
  public meaning: string;

  @Field({ nullable: true })
  public type: string;

  @Field(() => [String])
  public examples: string[];
}
