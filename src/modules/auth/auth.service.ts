import { JwtPayload } from './../../clients/auth/entities/jwt-payload';
import { AuthService } from '@auth-client/auth.service';
import { UserCredential } from '@auth-client/entities/user-credential';
import { GoogleUser } from '@auth-client/google.authenticator';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService, UserServiceToken } from '@user-client/user.service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async mockLoginByGoogleUser(): Promise<UserCredential> {
    const user = await this.userService.findByEmail('test@gmail.com');

    if (!user) {
      throw new NotFoundException('Not found user with email: test@gmail.com');
    }

    return {
      accessToken: this.jwtService.sign(
        {
          sub: user._id.toString(),
          resourceAccess: {
            client: ['read'],
          },
        },
        { expiresIn: '10h' },
      ),
      refreshToken: this.jwtService.sign({}, { expiresIn: '10d' }),
      name: 'test user',
    };
  }

  async loginByGoogleUser(googleUser: GoogleUser): Promise<UserCredential> {
    let user = await this.userService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.userService.createOne({
        email: googleUser.email,
        avatar: googleUser.avatar,
        fullName: googleUser.fullName,
      });
    }

    const jwtPayload: JwtPayload = {
      sub: user._id.toString(),
      resourceAccess: {
        client: ['read'],
      },
    };

    return {
      accessToken: this.jwtService.sign(jwtPayload, { expiresIn: '10h' }),
      refreshToken: this.jwtService.sign(user._id, { expiresIn: '10d' }),
      name: user.name,
    };
  }
}
