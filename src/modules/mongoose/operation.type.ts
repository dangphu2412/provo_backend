/**
 * This API was written based on description of mongodb document
 * @link https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#std-label-bulkwrite-write-operations-deleteOneMany
 */
export interface BulkWriteOperation<T> {
  updateOne?: {
    filter: {
      [P in keyof T]?: any;
    };
    update: {
      $set: {
        [P in keyof T]?: any;
      };
    };
    upsert: boolean;
  };
  insertOne?: {
    document: any;
  };
  deleteOne?: {
    filter: any;
    collation: any;
  };
  replaceOne?: {
    filter: any;
    replacement: any;
    upsert: boolean;
    collation: any;
    hint: any | string;
  };
}
