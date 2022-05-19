import { ProviderCollectionResolver } from '@collection-client/provider-collection.resolver';
import { Test, TestingModule } from '@nestjs/testing';
import { VocabularyLoader } from '@vocabulary/vocabulary-loader';
import { VocabularyServiceToken } from '@vocabulary-client/vocabulary.service';
import { ProviderCollectionServiceToken } from '../service/provider-collection.service';

describe('ProviderCollectionResolver', () => {
  let resolver: ProviderCollectionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderCollectionResolver,
        {
          provide: ProviderCollectionServiceToken,
          useValue: {},
        },
        {
          provide: VocabularyServiceToken,
          useValue: {},
        },
        {
          provide: VocabularyLoader,
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<ProviderCollectionResolver>(
      ProviderCollectionResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
