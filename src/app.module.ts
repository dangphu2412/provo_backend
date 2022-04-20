import { ExternalModuleRegister } from '@config/external-service-register';
import { Module } from '@nestjs/common';
import { UserModule } from './clients/user/user.module';
import { AuthModule } from './clients/auth/auth.module';
import { VocabularyModule } from '@vocabulary-client/vocabulary.module';
import { PaginationModule } from '@pagination/pagination.module';

@Module({
  imports: [
    ...ExternalModuleRegister.register(),
    PaginationModule.forFeature({
      defaultLimit: 20,
      defaultOffset: 0,
    }),
    UserModule,
    AuthModule,
    VocabularyModule,
  ],
})
export class AppModule {}
