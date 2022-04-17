import { UserServiceToken } from './user.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { UserServiceImpl } from '@user/user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: UserServiceToken,
      useClass: UserServiceImpl,
    },
    UserResolver,
  ],
  exports: [UserServiceToken],
})
export class UserModule {}
