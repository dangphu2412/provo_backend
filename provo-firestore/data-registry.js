module.exports.DataRegistry = class SchemaMapperRegistry {
  #schemaMappers = new Map();

  register(name, schema) {
    this.#schemaMappers.set(name, schema);
    return this;
  }
  getSchema(name) {
    return this.#schemaMappers.get(name);
  }
};
