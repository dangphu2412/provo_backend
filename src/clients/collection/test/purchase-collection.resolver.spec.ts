import { PurchaseCollectionResolver } from '@collection-client/provider-collection.resolver';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderCollectionServiceToken } from '../service/provider-collection.service';

describe('PurchaseCollectionResolver', () => {
  let resolver: PurchaseCollectionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseCollectionResolver,
        {
          provide: ProviderCollectionServiceToken,
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<PurchaseCollectionResolver>(
      PurchaseCollectionResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
