import { MongoCursorTransformation } from './transformation/mongo-transformation';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigStorage, PaginationConfig } from './config-storage';
import { CursorTransformationToken } from './transformation/cursor-transformation.strategy';
import {
  CursorPaginationQueryBuilderImpl,
  CursorPaginationBuilderToken,
} from './cursor-pagination.builder';

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
          provide: CursorPaginationBuilderToken,
          useClass: CursorPaginationQueryBuilderImpl,
        },
      ],
      exports: [CursorTransformationToken, CursorPaginationBuilderToken],
    };
  }
}
