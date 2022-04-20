import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/pagination-args';

@ArgsType()
export class VocabularyArgs extends PaginationArgs {
  @Field(() => String, { nullable: true })
  search?: string;
}
