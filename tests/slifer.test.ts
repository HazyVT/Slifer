import { expect, test } from 'bun:test';
import Slifer from '..';

test("Slifer Version", () => {
    expect(Slifer.getVersion()).toBe("Slifer v0.0.1");
})