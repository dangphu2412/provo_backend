import { ExternalModuleRegister } from '@config/external-service-register';
import { Module } from '@nestjs/common';
import { UserModule } from './clients/user/user.module';
import { AuthModule } from './clients/auth/auth.module';
import { VocabularyModule } from '@vocabulary-client/vocabulary.module';
import { PaginationModule } from '@pagination/pagination.module';
import { ExcelModule } from './clients/excel/excel.module';

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
    ExcelModule,
  ],
})
export class AppModule {}
