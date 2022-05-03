import { DynamicModule, Module } from '@nestjs/common';
import { ConfigStorage, PaginationConfig } from './config-storage';
import {
  CursorConnectionExecutorImpl,
  CursorConnectionExecutorToken,
} from './cursor-connection-excutor';
import { CursorTransformationToken } from './transformation/cursor-transformation.strategy';
import { MongoCursorTransformation } from './transformation/mongo-transformation';

export type PaginationModuleOptions = Partial<PaginationConfig>;

@Module({})
export class PaginationModule {
  public static forFeature(options?: PaginationModuleOptions): DynamicModule {
    const DEFAULT_LIMIT = 20;
    const DEFAULT_OFFSET = 0;

    return {
      module: PaginationModule,
      global: true,
      providers: [
        {
          provide: ConfigStorage,
          useFactory() {
            const instance = new ConfigStorage();

            instance.setDefaultLimit(DEFAULT_LIMIT);
            instance.setDefaultOffset(DEFAULT_OFFSET);

            if (options) {
              if (options.defaultLimit) {
                instance.setDefaultLimit(options.defaultLimit);
              }
              if (options.defaultOffset) {
                instance.setDefaultOffset(options.defaultOffset);
              }
            }
            return instance;
          },
        },
        {
          provide: CursorTransformationToken,
          useClass: MongoCursorTransformation,
        },
        {
          provide: CursorConnectionExecutorToken,
          useClass: CursorConnectionExecutorImpl,
        },
      ],
      exports: [CursorTransformationToken, CursorConnectionExecutorToken],
    };
  }
}
