import { expect, test } from 'bun:test';
import Slifer from '..';

test("Math Sum 2 + 2", () => {
    expect(Slifer.Math.sum(2, 2)).toBe(4);
})

test("Math Sum 1.201839 + 1.1029389", () => {
    expect(Slifer.Math.sum(1.201839, 1.1029389)).toBe(1.1029389 + 1.201839);
})