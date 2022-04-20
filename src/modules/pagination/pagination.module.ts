import { DynamicModule, Module } from '@nestjs/common';
import { PaginationConfig } from './config-storage';
import { PaginationContainer } from './pagination.container';
import { QueryCompiler } from './query-compiler';
import { CursorTransformation } from './transformation/cursor-transformation';
import { TransformationType } from './transformation/transformation-type.enum';

export interface PaginationModuleOptions extends Partial<PaginationConfig> {
  transformationType?: TransformationType;
}

@Module({
  providers: [CursorTransformation, QueryCompiler],
  exports: [QueryCompiler],
})
export class PaginationModule {
  public static forFeature(options?: PaginationModuleOptions): DynamicModule {
    const DEFAULT_LIMIT = 20;
    const DEFAULT_OFFSET = 0;

    const configStore = PaginationContainer.getConfigStore();

    configStore.setDefaultLimit(DEFAULT_LIMIT);
    configStore.setDefaultOffset(DEFAULT_OFFSET);

    if (options) {
      if (options.defaultLimit) {
        configStore.setDefaultLimit(options.defaultLimit);
      }
      if (options.defaultOffset) {
        configStore.setDefaultOffset(options.defaultOffset);
      }
      configStore.setTransformationType(
        options.transformationType ?? TransformationType.BASE_64,
      );
    }

    return {
      module: PaginationModule,
    };
  }
}
