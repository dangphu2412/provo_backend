import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceImpl } from '../../../modules/auth/auth.service';
import { GoogleAuthenticatorImpl } from '../../../modules/auth/google-authenticator';
import { AuthResolver } from '../auth.resolver';
import { AuthServiceToken } from '../auth.service';
import { GoogleAuthenticatorToken } from '../google.authenticator';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthServiceImpl;
  let googleAuthenticator: GoogleAuthenticatorImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: GoogleAuthenticatorToken,
          useValue: {},
        },
        {
          provide: AuthServiceToken,
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    googleAuthenticator = module.get<GoogleAuthenticatorImpl>(
      GoogleAuthenticatorToken,
    );
    authService = module.get<AuthServiceImpl>(AuthServiceToken);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
