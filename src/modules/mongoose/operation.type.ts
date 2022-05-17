export interface BulkWriteOperation {
  updateOne: {
    filter: {
      [key: string]: any;
    };
    update: {
      $set: Record<any, any>;
    };
    upsert: boolean;
  };
}
