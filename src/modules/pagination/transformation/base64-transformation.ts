import { CursorTransformationStrategy } from './cursor-transformation.strategy';

export class Base64CursorTransformationStrategy
  implements CursorTransformationStrategy
{
  transform(input: string): string {
    return Buffer.from(input).toString('base64');
  }
  parse(cursor: string): string {
    return Buffer.from(cursor, 'base64').toString('ascii');
  }
}
