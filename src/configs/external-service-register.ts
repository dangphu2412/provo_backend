import { NestModuleRegister } from '@nest-extensions/nest-extension.types';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

export class ExternalModuleRegister {
  public static register(): NestModuleRegister {
    return [
      ConfigModule.forRoot(),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get('MONGO_URI'),
        }),
      }),
      GraphQLModule.forRootAsync<ApolloDriverConfig>({
        driver: ApolloDriver,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            debug: configService.get('NODE_ENV') === 'development',
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            path: configService.get('GRAPHQL_ROUTE') || '/graphql',
            context: ({ req }): object => {
              return req;
            },
          };
        },
      }),
    ];
  }
}
