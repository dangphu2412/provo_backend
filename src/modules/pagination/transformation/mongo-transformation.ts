import { CursorTransformation } from './cursor-transformation.strategy';
import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoCursorTransformation
  implements CursorTransformation<Types.ObjectId>
{
  transform(input: Types.ObjectId): string {
    return Buffer.from(input.toString()).toString('base64');
  }

  parse(cursor: string): Types.ObjectId {
    return new Types.ObjectId(Buffer.from(cursor, 'base64').toString('ascii'));
  }
}
