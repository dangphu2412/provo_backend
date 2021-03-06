import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceToken } from '@user-client/user.service';
import { Types, LeanDocument } from 'mongoose';
import { UserCredential } from '@auth-client/entities/user-credential';
import { User } from '@user-client/user.model';
import { ObjectId } from '@mongoose/type';
import { UserServiceImpl } from '@user/user.service';
import { AuthServiceImpl } from '../auth.service';

describe('AuthService', () => {
  let service: AuthServiceImpl;
  let userService: UserServiceImpl;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthServiceImpl,
        {
          provide: UserServiceToken,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserServiceImpl>(UserServiceToken);
    jwtService = module.get<JwtService>(JwtService);
    service = module.get<AuthServiceImpl>(AuthServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('loginByGoogleUser success', async () => {
    const userCredential: UserCredential = {
      accessToken: 'token',
      refreshToken: 'Currently, we do not support refresh token',
      name: '',
    };
    const mockUser: LeanDocument<User & ObjectId> = {
      _id: new Types.ObjectId(),
      name: '',
      email: '',
      avatarSrc: '',
      credit: 0,
      ownedCollections: [],
      paidCollections: [],
      paidProviderCollectionIds: [],
      roles: [],
    };

    jest.spyOn(userService, 'findByEmail').mockImplementation(() => {
      return Promise.resolve(mockUser);
    });

    jest
      .spyOn(jwtService, 'signAsync')
      .mockImplementation(() => Promise.resolve('token'));

    expect(
      await service.login({
        sub: '',
        fullName: '',
        email: '',
        avatar: '',
      }),
    ).toStrictEqual(userCredential);
  });
});
