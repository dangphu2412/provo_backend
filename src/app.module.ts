import { ExternalModuleRegister } from '@config/external-service-register';
import { Module } from '@nestjs/common';
import { UsersModule } from './clients/users/users.module';

@Module({
  imports: [...ExternalModuleRegister.register(), UsersModule],
})
export class AppModule {}
