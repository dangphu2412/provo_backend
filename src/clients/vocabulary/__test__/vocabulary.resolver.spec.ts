import { Test, TestingModule } from '@nestjs/testing';
import { CsvParser } from '../vocab-excel-proccessor';
import { VocabularyResolver } from '../vocabulary.resolver';
import { VocabularyServiceToken } from '../vocabulary.service';

describe('VocabularyResolver', () => {
  let resolver: VocabularyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VocabularyResolver,
        CsvParser,
        {
          provide: VocabularyServiceToken,
          useValue: {},
        }
      ],
    }).compile();

    resolver = module.get<VocabularyResolver>(VocabularyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
