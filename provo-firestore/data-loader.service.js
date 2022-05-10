const { assert } = require('console');
const { open } = require('fs/promises');

module.exports.DataLoader = class DataLoader {
  static FOLDER_NAME = 'data';
  static FILE_EXTENSION = '.json';

  #name;
  #schema;

  constructor(name, schema) {
    assert(typeof name === 'string', 'name must be string type');
    this.#name = name;
    if (schema) {
      assert(typeof schema === 'object', 'schema must be object type');
      this.#schema = schema;
    }
  }

  /**
   * @param {import('firebase-admin/firestore').Firestore} databaseHost
   */
  async load(databaseHost) {
    const collection = databaseHost.collection(this.#name);

    const snapshot = await collection.get();

    const pathToSave = `./${DataLoader.FOLDER_NAME}/${this.#name}${
      DataLoader.FILE_EXTENSION
    }`;

    const dataToWrite = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const subCollections = await doc.ref.listCollections();

      await Promise.all(
        subCollections.map(async (subCollection) => {
          const subCollectionSnapshot = await doc.ref
            .collection(subCollection.id)
            .get();
          const subCollectionData = [];
          for (const subDoc of subCollectionSnapshot.docs) {
            subCollectionData.push(subDoc.data());
          }
          data[subCollection.id] = subCollectionData;
        }),
      );

      dataToWrite.push(this.#mapToSchema(data));
    }

    let fileHandle;
    try {
      fileHandle = await open(pathToSave, 'w');
      fileHandle.writeFile(JSON.stringify(dataToWrite, null, 2));
    } catch (error) {
      console.log(error);
    } finally {
      fileHandle.close();
    }
  }

  #mapToSchema(data) {
    if (!this.#schema) {
      return data;
    }

    const returnData = {};
    Object.keys(this.#schema).forEach((keyFrom) => {
      const keyTo = this.#schema[keyFrom];
      returnData[keyFrom] = data[keyTo];
    });
    return data;
  }
};
