import { AuthService } from '@auth-client/auth.service';
import { JwtPayload } from '@auth-client/entities/jwt-payload';
import { UserCredential } from '@auth-client/entities/user-credential';
import { GoogleUser } from '@auth-client/google.authenticator';
import { ObjectId } from '@mongoose/type';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateGoogleUserDto } from '@user-client/dto/create-user.dto';
import { User } from '@user-client/user.model';
import { UserService, UserServiceToken } from '@user-client/user.service';
import { LeanDocument } from 'mongoose';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(): Promise<UserCredential>;
  public async login(googleUser: GoogleUser): Promise<UserCredential>;
  public async login(userRequest?: any) {
    let user;

    if (isEmpty(userRequest)) {
      user = await this.userService.findByEmail('test@gmail.com');

      if (!user) {
        throw new NotFoundException(
          'Not found user with email: test@gmail.com',
        );
      }
    } else {
      user = await this.userService.findByEmail(
        (userRequest as GoogleUser).email,
      );

      if (!user) {
        user = await this.registerGoogleUser(userRequest as GoogleUser);
      }
    }

    return this.generateUserCredential(user);
  }

  private registerGoogleUser(googleUser: GoogleUser) {
    const createUserDto = new CreateGoogleUserDto();
    createUserDto.email = googleUser.email;
    createUserDto.avatar = googleUser.avatar;
    createUserDto.fullName = googleUser.fullName;
    return this.userService.createOne(createUserDto);
  }

  private async generateUserCredential(
    user: LeanDocument<User & ObjectId>,
  ): Promise<UserCredential> {
    const jwtPayload: JwtPayload = {
      sub: user._id.toString(),
      roles: user.roles,
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
}
