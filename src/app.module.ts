import { ExternalModuleRegister } from '@config/external-service-register';
import { Module } from '@nestjs/common';
import { PaginationModule } from '@pagination/pagination.module';
import { VocabularyModule } from '@vocabulary-client/vocabulary.module';
import { AuthModule } from './clients/auth/auth.module';
import { CollectionModule } from './clients/collection/collection.module';
import { UserModule } from './clients/user/user.module';
import { HealthModule } from './clients/health-check/health.module';

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
    CollectionModule,
    HealthModule,
  ],
})
export class AppModule {}
