export class EnvLoaderUtils {
  public static load(rawConfigString: string) {
    return rawConfigString.trim().split(',');
  }
}
