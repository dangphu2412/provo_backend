import { Types, LeanDocument } from 'mongoose';
import {
  VocabularyService,
  VocabularyServiceToken,
} from '@vocabulary-client/vocabulary.service';
import { Inject, Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { ObjectId } from '@mongoose/type';
import { Vocabulary } from './vocabulary.model';

@Injectable({
  scope: Scope.REQUEST,
})
export class VocabularyLoader extends DataLoader<
  Types.ObjectId,
  LeanDocument<Vocabulary & ObjectId>
> {
  constructor(
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
  ) {
    super(async (vocabularyIds: Types.ObjectId[]) => {
      const vocabularies = await this.vocabularyService.findByIds(
        vocabularyIds,
      );
      const vocabularyKeyById: Record<
        string,
        LeanDocument<Vocabulary & ObjectId>
      > = vocabularies.reduce((map, vocabulary) => {
        map[vocabulary._id.toString()] = vocabulary;
        return map;
      }, {});

      return vocabularyIds.map((id) => {
        return vocabularyKeyById[id.toString()];
      });
    });
  }
}
