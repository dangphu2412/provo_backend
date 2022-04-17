import { AuthService } from '@auth-client/auth.service';
import { UserCredential } from '@auth-client/entities/user-credential';
import { GoogleUser } from '@auth-client/google.authenticator';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService, UserServiceToken } from '@user-client/user.service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async loginByGoogleUser(googleUser: GoogleUser): Promise<UserCredential> {
    let user = await this.userService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.userService.createOne({
        email: googleUser.email,
        avatar: googleUser.avatar,
        fullName: googleUser.fullName,
      });
    }

    return {
      accessToken: this.jwtService.sign(user, { expiresIn: '10h' }),
      refreshToken: this.jwtService.sign({}, { expiresIn: '10d' }),
      name: googleUser.fullName,
    };
  }
}
