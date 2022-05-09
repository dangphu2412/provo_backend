import { ObjectType } from '@nestjs/graphql';
import { createConnection } from '@pagination/connection.factory';
import { UserCollectionType } from './user-collection.type';

@ObjectType()
export class UserCollectionConnection extends createConnection(
  UserCollectionType,
) {}
