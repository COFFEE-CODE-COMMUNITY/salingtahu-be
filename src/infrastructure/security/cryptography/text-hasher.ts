export abstract class TextHasher {
  public abstract hash(plainText: string): string
  public abstract compare(plainText: string, hashedText: string): boolean
}
