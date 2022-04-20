import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/pagination-args';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class VocabularyArgs extends PaginationArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
