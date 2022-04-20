export interface CursorTransformationStrategy {
  transform(input: string): string;
  parse(cursor: string): string;
}
