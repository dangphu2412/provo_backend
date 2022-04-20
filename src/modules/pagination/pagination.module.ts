import { DynamicModule } from '@nestjs/common';
import { PaginationConfig } from './config-storage';
import { PaginationContainer } from './pagination.container';

export type PaginationModuleOptions = Partial<PaginationConfig>;

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
    }

    return {
      module: PaginationModule,
    };
  }
}
