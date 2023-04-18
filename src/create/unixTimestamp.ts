export class UnixTimestamp {
  private timestampInMilliseconds: number;

  constructor() {
    this.timestampInMilliseconds = Date.now();
  }

  toSeconds(): number {
    return Math.floor(this.timestampInMilliseconds / 1000);
  }

  toMilliseconds(): number {
    return this.timestampInMilliseconds;
  }
}
