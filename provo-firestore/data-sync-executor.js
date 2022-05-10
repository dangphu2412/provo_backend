const { DataLoader } = require('./data-loader.service');

module.exports.DataSyncExecutor = class DataSyncExecutor {
  #registry;

  /**
   * @param {import('./data-registry').DataRegistry} dataRegistry
   */
  constructor(dataRegistry) {
    this.#registry = dataRegistry;
  }

  /**
   * @param {import('firebase-admin/firestore').Firestore} databaseHost
   */
  async execute(databaseHost) {
    const collections = await databaseHost.listCollections();

    await Promise.all(
      collections.map((collection) => {
        const schemaMapper = this.#registry.getSchema(collection.id);

        const dataLoader = new DataLoader(collection.id, schemaMapper);
        return dataLoader.load(databaseHost);
      }),
    );
  }
};
