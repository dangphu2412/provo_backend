import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class DefinitionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  public meaning: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  public type: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  public examples: string[];
}
