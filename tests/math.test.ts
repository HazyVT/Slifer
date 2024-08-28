import { expect, test } from 'bun:test';
import Slifer from '..';

test("Math Sum Test One", () => {
    expect(Slifer.Math.sum(2, 2)).toBe(4);
})

test("Math Sum Test Two", () => {
    expect(Slifer.Math.sum(1.201839, 1.1029389)).toBe(1.1029389 + 1.201839);
})

test("Math Sum Test Three", () => {
    expect(Slifer.Math.sum(-24, -24)).toBe(-48);
})
