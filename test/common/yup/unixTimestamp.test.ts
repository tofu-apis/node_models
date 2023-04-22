import { UnixTimestamp } from '../../../src/create/yup/unixTimestamp';
import { describe, test, expect } from '@jest/globals';

describe('UnixTimestamp', () => {
  test('toSeconds() should return the current Unix timestamp', () => {
    const beforeTest = Math.floor(Date.now() / 1000);
    const currentUnixTimestamp = new UnixTimestamp().toSeconds();
    const afterTest = Math.floor(Date.now() / 1000);

    expect(currentUnixTimestamp).toBeGreaterThanOrEqual(beforeTest);
    expect(currentUnixTimestamp).toBeLessThanOrEqual(afterTest);
  });

  test('toMilliseconds() should return the current Unix timestamp', () => {
    const beforeTest = Math.floor(Date.now());
    const currentUnixTimestamp = new UnixTimestamp().toMilliseconds();
    const afterTest = Math.floor(Date.now());

    expect(currentUnixTimestamp).toBeGreaterThanOrEqual(beforeTest);
    expect(currentUnixTimestamp).toBeLessThanOrEqual(afterTest);
  });
});
