import { AuthService } from '@auth-client/auth.service';
import { UserCredential } from '@auth-client/entities/user-credential';
import { GoogleUser } from '@auth-client/google.authenticator';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateGoogleUserDto } from '@user-client/dto/create-user.dto';
import { UserService, UserServiceToken } from '@user-client/user.service';
import { JwtPayload } from '@auth-client/entities/jwt-payload';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async mockLoginByGoogleUser(): Promise<UserCredential> {
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

  public async loginByGoogleUser(
    googleUser: GoogleUser,
  ): Promise<UserCredential> {
    let user = await this.userService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.registerGoogleUser(googleUser);
    }

    const jwtPayload: JwtPayload = {
      sub: user._id.toString(),
      resourceAccess: {
        client: ['read'],
      },
      realmAccess: {},
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, { expiresIn: '10h' }),
      'Currently, we do not support refresh token',
    ]);

    return {
      accessToken,
      refreshToken,
      name: user.name,
    };
  }

  private registerGoogleUser(googleUser: GoogleUser) {
    const createUserDto = new CreateGoogleUserDto();
    createUserDto.email = googleUser.email;
    createUserDto.avatar = googleUser.avatar;
    createUserDto.fullName = googleUser.fullName;
    return this.userService.createOne(createUserDto);
  }
}
