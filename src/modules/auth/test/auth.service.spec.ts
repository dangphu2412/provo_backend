import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceToken } from '@user-client/user.service';
import { Types, LeanDocument } from 'mongoose';
import { UserCredential } from '../../../clients/auth/entities/user-credential';
import { User } from '../../../clients/user/user.model';
import { ObjectId } from '@mongoose/type';
import { UserServiceImpl } from '../../user/user.service';
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
            sign: jest.fn(),
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
      accessToken: '',
      refreshToken: '',
      name: '',
    };
    const mockUser: LeanDocument<User & ObjectId> = {
      _id: new Types.ObjectId(),
      name: '',
      email: '',
      avatarSrc: '',
      credit: 0,
      ownedCollections: [],
    };

    jest.spyOn(userService, 'findByEmail').mockImplementation(() => {
      return Promise.resolve(mockUser);
    });

    jest.spyOn(jwtService, 'sign').mockImplementation(() => '');

    expect(
      await service.loginByGoogleUser({
        sub: '',
        fullName: '',
        email: '',
        avatar: '',
      }),
    ).toStrictEqual(userCredential);
  });
});
