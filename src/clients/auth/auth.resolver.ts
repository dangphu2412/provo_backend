import {
  GoogleAuthenticator,
  GoogleAuthenticatorToken,
} from '@auth-client/google.authenticator';
import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService, AuthServiceToken } from './auth.service';
import { UserCredential } from './entities/user-credential';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(GoogleAuthenticatorToken)
    private readonly googleAuthenticator: GoogleAuthenticator,
    @Inject(AuthServiceToken)
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => UserCredential)
  async loginByGoogleAccessToken(
    @Args({ name: 'idToken', type: () => String }) idToken: string,
  ): Promise<UserCredential> {
    const googleUser = await this.googleAuthenticator.verify(idToken);

    return this.authService.loginByGoogleUser(googleUser);
  }
}
