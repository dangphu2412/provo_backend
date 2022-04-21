import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { IsCursor } from '../decorator/is-cursor';

@ArgsType()
export class PaginationArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsCursor()
  after?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsCursor()
  before?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  last?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  first?: number;
}
