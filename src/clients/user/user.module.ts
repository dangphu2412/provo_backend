import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserServiceImpl } from '@user/user.service';
import { User, UserSchema } from './user.model';
import { UserServiceToken } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: UserServiceToken,
      useClass: UserServiceImpl,
    },
  ],
  exports: [UserServiceToken],
})
export class UserModule {}
