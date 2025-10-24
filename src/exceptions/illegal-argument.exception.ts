export class IllegalArgumentException extends Error {
  public constructor(message: string) {
    super(message)
    this.name = "IllegalArgumentException"
  }
}
