import { Injectable } from '@nestjs/common';

export interface PaginationConfig {
  defaultLimit: number;
  defaultOffset: number;
}

@Injectable()
export class ConfigStorage {
  private static DEFAULT_LIMIT_KEY = 'LIMIT';
  private static DEFAULT_OFFSET_KEY = 'OFFSET';

  private store: Record<string, any> = {};

  public getDefaultLimit(): number {
    return this.store[ConfigStorage.DEFAULT_LIMIT_KEY];
  }
  public getDefaultOffset(): number {
    return this.store[ConfigStorage.DEFAULT_OFFSET_KEY];
  }

  public setDefaultLimit(value: number): void {
    this.store[ConfigStorage.DEFAULT_LIMIT_KEY] = value;
  }
  public setDefaultOffset(value: number): void {
    this.store[ConfigStorage.DEFAULT_OFFSET_KEY] = value;
  }
}
