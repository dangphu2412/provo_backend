import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateVocabDto } from './dto/create-vocab.dto';
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
