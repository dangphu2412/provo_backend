const { assert } = require('console');
const { appendFile } = require('fs/promises');

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

    const document = await collection.get();
    const pathToSave = `./${DataLoader.FOLDER_NAME}/${this.#name}${
      DataLoader.FILE_EXTENSION
    }`;

    const dataToWrite = document.docs.map((doc) =>
      this.#mapToSchema(doc.data()),
    );

    await appendFile(pathToSave, JSON.stringify(dataToWrite, null, 2));
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
