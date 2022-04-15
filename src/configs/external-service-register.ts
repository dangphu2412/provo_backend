import { NestModuleRegister } from '@nest-extensions/nest-extension.types';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export class ExternalModuleRegister {
  public static register(): NestModuleRegister {
    return [
      ConfigModule.forRoot(),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get('MONGODB_URI'),
        }),
        inject: [ConfigService],
      }),
    ];
  }
}
