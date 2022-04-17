import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleAuthenticatorImpl } from '@auth/google-authenticator';
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { GoogleAuthenticatorToken } from './google.authenticator';
import { JwtModule } from '@nestjs/jwt';
import * as assert from 'assert';
import { AuthServiceToken } from './auth.service';
import { AuthServiceImpl } from '@auth/auth.service';
import { UserModule } from '@user-client/user.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        assert(
          configService.get('JWT_SECRET'),
          'JWT_SECRET is required in configuration',
        );
        return {
          secret: configService.get<string>('JWT_SECRET'),
        };
      },
    }),
    UserModule,
  ],
  providers: [
    AuthResolver,
    {
      provide: GoogleAuthenticatorToken,
      useClass: GoogleAuthenticatorImpl,
    },
    {
      provide: AuthServiceToken,
      useClass: AuthServiceImpl,
    },
  ],
})
export class AuthModule {}
