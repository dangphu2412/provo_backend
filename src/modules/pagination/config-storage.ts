import { TransformationType } from './transformation/transformation-type.enum';

export interface PaginationConfig {
  defaultLimit: number;
  defaultOffset: number;
}

export class ConfigStorage {
  private static DEFAULT_LIMIT_KEY = 'LIMIT';
  private static DEFAULT_OFFSET_KEY = 'OFFSET';
  private static REGISTERED_TRANSFORMATION = 'REGISTERED_TRANSFORMATION';

  private store: Record<string, any> = {};

  public getDefaultLimit(): number {
    return this.store[ConfigStorage.DEFAULT_LIMIT_KEY];
  }
  public getDefaultOffset(): number {
    return this.store[ConfigStorage.DEFAULT_OFFSET_KEY];
  }
  public getTransformationType(): TransformationType {
    return this.store[ConfigStorage.REGISTERED_TRANSFORMATION];
  }

  public setDefaultLimit(value: number): void {
    this.store[ConfigStorage.DEFAULT_LIMIT_KEY] = value;
  }
  public setDefaultOffset(value: number): void {
    this.store[ConfigStorage.DEFAULT_OFFSET_KEY] = value;
  }
  public setTransformationType(value: TransformationType): void {
    this.store[ConfigStorage.REGISTERED_TRANSFORMATION] = value;
  }
}
