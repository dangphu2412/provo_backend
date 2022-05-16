import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsArray } from 'class-validator';

@InputType()
export class DefinitionDto {
  @Field()
  @IsString()
  public meaning: string;

  @Field()
  @IsString()
  public type: string;

  @Field(() => [String])
  @IsArray()
  public examples: string[];
}
