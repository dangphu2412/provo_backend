import { ExternalModuleRegister } from '@config/external-service-register';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@user-client/user.model';
import { FireStoreMigration } from './firestore-migration';

@Module({
  imports: [
    ...ExternalModuleRegister.register(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [FireStoreMigration],
})
export class MigrationModule {}
