import { Test, TestingModule } from '@nestjs/testing';
import { VocabularyResolver } from '../vocabulary.resolver';
import { VocabularyServiceToken } from '../vocabulary.service';

describe('VocabularyResolver', () => {
  let resolver: VocabularyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabularyResolver,
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
