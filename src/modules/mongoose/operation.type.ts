export interface BulkWriteOperation {
  updateOne: {
    filter: {
      [key: string]: any;
    };
    update: {
      [key: string]: any;
    };
    upsert: boolean;
  };
}
