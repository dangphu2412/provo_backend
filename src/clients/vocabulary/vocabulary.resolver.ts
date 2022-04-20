import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { VocabularyConnection } from './dto/vocabulary-connection';
import { VocabularyArgs } from './dto/vocabulary.arg';
import {
  VocabularyService,
  VocabularyServiceToken,
} from './vocabulary.service';

@Resolver()
export class VocabularyResolver {
  constructor(
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
  ) {}

  @Query(() => VocabularyConnection)
  searchVocabularies(
    @Args() args: VocabularyArgs,
  ): Promise<VocabularyConnection> {
    return this.vocabularyService.search(args);
  }

  @Mutation(() => Boolean, { nullable: true })
  async createVocabularies(
    @Args({
      name: 'vocabularies',
      type: () => [CreateVocabDto],
    })
    createVocabulariesDto: CreateVocabDto[],
  ) {
    await this.vocabularyService.createMany(createVocabulariesDto);
  }
}
