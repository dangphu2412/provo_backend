import { ObjectType } from '@nestjs/graphql';
import { createConnection } from '@pagination/connection.factory';
import { VocabularyType } from './vocabulary.type';

@ObjectType()
export class VocabularyConnection extends createConnection(VocabularyType) {}
