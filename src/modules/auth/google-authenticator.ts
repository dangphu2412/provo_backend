import { EnvLoaderUtils } from './../../utils/env-loader.util';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  GoogleAuthenticator,
  GoogleUser,
} from '@auth-client/google.authenticator';
import * as assert from 'assert';

@Injectable()
export class GoogleAuthenticatorImpl implements GoogleAuthenticator {
  private readonly oAuth2Client: OAuth2Client;
  private readonly audienceClientIds: string[];

  constructor(configService: ConfigService) {
    const appClientId = configService.get<string>('APP_GOOGLE_CLIENT_ID');
    const rawAudienceClientIds = configService.get<string>(
      'AUDIENCE_GOOGLE_CLIENT_IDS',
    );

    assert(appClientId, 'Missing APP_GOOGLE_CLIENT_ID in configuration');
    assert(
      rawAudienceClientIds,
      'Missing AUDIENCE_GOOGLE_CLIENT_IDS in configuration',
    );

    this.oAuth2Client = new OAuth2Client(appClientId);
    this.audienceClientIds = EnvLoaderUtils.load(rawAudienceClientIds);
  }

  public async verify(idToken: string): Promise<GoogleUser> {
    const loginTicket = await this.getLoginTicket(idToken);

    const payload = loginTicket.getPayload();

    this.validateProvidedScopes(payload);

    return {
      email: payload.email,
      fullName: payload.family_name,
      sub: payload.sub,
      avatar: payload.picture,
    };
  }

  private async getLoginTicket(idToken: string) {
    try {
      return await this.oAuth2Client.verifyIdToken({
        idToken: idToken,
        audience: this.audienceClientIds,
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        'Invalid idToken provided. Please check your credentials',
      );
    }
  }

  private validateProvidedScopes(tokenPayload: TokenPayload) {
    if (!tokenPayload.email || !tokenPayload.family_name) {
      throw new UnprocessableEntityException(
        'IdToken provided is missing scope profile when requested',
      );
    }
  }
}
