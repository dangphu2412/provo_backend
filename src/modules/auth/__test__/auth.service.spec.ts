import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceToken } from '@user-client/user.service';
import { User } from '../../../clients/user/user.model';
import { AuthServiceImpl } from '../auth.service';
import { UserCredential } from './../../../clients/auth/entities/user-credential';
import { UserServiceImpl } from './../../user/user.service';

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
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          }
        }
      ],
    })
    .compile();

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
    const mockUser: User = new User();
    mockUser._id = new Types.ObjectId();
    mockUser.name = '';

    jest.spyOn(userService, 'findByEmail').mockImplementation((_) => {
      return Promise.resolve(mockUser);
    });

    jest.spyOn(jwtService, 'sign').mockImplementation((_, __) => '');

    expect(await service.loginByGoogleUser({
      sub: '',
      fullName: '',
      email: '',
      avatar: '',
    })).toStrictEqual(userCredential);
  })
});
