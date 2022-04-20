import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsBase64, IsOptional } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  first?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsBase64()
  after?: string;

  @Field(() => Int, { nullable: true })
  last?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsBase64()
  before?: string;
}
