import { ExternalModuleRegister } from '@config/external-service-register';
import { Module } from '@nestjs/common';
import { UserModule } from './clients/user/user.module';
import { AuthModule } from './clients/auth/auth.module';
import { VocabularyModule } from '@vocabulary-client/vocabulary.module';

@Module({
  imports: [
    ...ExternalModuleRegister.register(),
    UserModule,
    AuthModule,
    VocabularyModule,
  ],
})
export class AppModule {}
