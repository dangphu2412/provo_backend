import {
  VocabularyService,
  VocabularyServiceToken,
} from './vocabulary.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { VocabularyType } from './dto/vocabulary.type';

@Resolver()
export class VocabularyResolver {
  constructor(
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
  ) {}

  @Query(() => [VocabularyType])
  searchVocabularies(@Args('text') text: string) {
    return this.vocabularyService.search(text);
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
    return;
  }
}
