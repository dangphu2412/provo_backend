export class CursorGenerator {
  public generate(input: string): string {
    return Buffer.from(input).toString('base64');
  }

  public parse(input: string): string {
    return Buffer.from(input, 'base64').toString('ascii');
  }
}
