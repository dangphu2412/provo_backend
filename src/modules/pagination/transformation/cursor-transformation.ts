import { CursorTransformationStrategy } from './cursor-transformation.strategy';
import { Injectable } from '@nestjs/common';
import { Base64CursorTransformationStrategy } from './base64-transformation';
import { TransformationType } from '../transformation/transformation-type.enum';
import { PaginationContainer } from '@pagination/pagination.container';

@Injectable()
export class CursorTransformation implements CursorTransformationStrategy {
  private strategy: CursorTransformationStrategy;

  constructor() {
    // TODO: Avoid register strategy in constructor
    const configStore = PaginationContainer.getConfigStore();
    const transformationType = configStore.getTransformationType();
    const typeToStrategy: Record<
      TransformationType,
      CursorTransformationStrategy
    > = {
      [TransformationType.BASE_64]: new Base64CursorTransformationStrategy(),
    };

    this.strategy = typeToStrategy[transformationType];
  }

  transform(input: string): string {
    return this.strategy.transform(input);
  }
  parse(cursor: string): string {
    return this.strategy.parse(cursor);
  }
}
