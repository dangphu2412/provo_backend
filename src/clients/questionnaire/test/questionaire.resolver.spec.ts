import { Test, TestingModule } from '@nestjs/testing';
import { QuestionaireResolver } from '../questionaire.resolver';

describe('QuestionaireResolver', () => {
  let resolver: QuestionaireResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionaireResolver],
    }).compile();

    resolver = module.get<QuestionaireResolver>(QuestionaireResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
