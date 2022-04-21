export const CursorTransformationToken = 'CursorTransformation';

export interface CursorTransformation<I> {
  transform(input: I): string;
  parse(cursor: string): I;
}
