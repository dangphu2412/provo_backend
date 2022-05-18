import { LeanDocument, Types } from 'mongoose';

export type ObjectId = { _id: Types.ObjectId };
export type LeanDoc<T> = LeanDocument<T> & ObjectId;
