import { ConfigStorage } from './config-storage';

export class PaginationContainer {
  private static configStore: ConfigStorage = new ConfigStorage();

  public static getConfigStore(): ConfigStorage {
    return PaginationContainer.configStore;
  }
}
