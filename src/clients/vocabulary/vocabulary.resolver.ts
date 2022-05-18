import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateVocabInput } from './dto/create-vocab.input';
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
      type: () => [CreateVocabInput],
    })
    createVocabulariesDto: CreateVocabInput[],
  ) {
    await this.vocabularyService.createMany(createVocabulariesDto);
  }
}
