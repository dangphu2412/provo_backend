import { ObjectType } from '@nestjs/graphql';
import { createConnection } from '@pagination/connection.factory';
import { ProviderCollectionType } from './provider-collection.type';

@ObjectType()
export class ProviderCollectionConnection extends createConnection(
  ProviderCollectionType,
) {}
