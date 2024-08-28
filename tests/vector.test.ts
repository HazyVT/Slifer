import { expect, test } from 'bun:test';
import Slifer from '..';

test("Add Test One", () => {
    const v1 = new Slifer.Vector2(1,1);
    v1.add(v1);

    expect(v1.getX()).toBe(2);
    expect(v1.getY()).toBe(2);
})

test("Add Test Two", () => {
    const v1 = new Slifer.Vector2(-24,-24);
    const v2 = new Slifer.Vector2(-12, -12);
    v1.add(v2);

    expect(v1.getX()).toBe(-36);
    expect(v1.getY()).toBe(-36);
})

test("Subtract Test One", () => {
    const v1 = new Slifer.Vector2(1,1);
    v1.subtract(v1);

    expect(v1.getX()).toBe(0);
    expect(v1.getY()).toBe(0);
})

test("Subtract Test Two", () => {
    const v1 = new Slifer.Vector2(-24,-24);
    const v2 = new Slifer.Vector2(-12, -12);
    v1.subtract(v2);

    expect(v1.getX()).toBe(-12);
    expect(v1.getY()).toBe(-12);
})

test("Mutiply Test One", () => {
    const v1 = new Slifer.Vector2(1,1);
    v1.multiply(v1);

    expect(v1.getX()).toBe(1);
    expect(v1.getY()).toBe(1);
})

test("Multiply Test Two", () => {
    const v1 = new Slifer.Vector2(-24,-24);
    const v2 = new Slifer.Vector2(-12, -12);
    v1.multiply(v2);

    expect(v1.getX()).toBe(288);
    expect(v1.getY()).toBe(288);
})

test("Divide Test One", () => {
    const v1 = new Slifer.Vector2(24,24);
    const v2 = new Slifer.Vector2(2, 2);
    v1.divide(v2);

    expect(v1.getX()).toBe(12);
    expect(v1.getY()).toBe(12);
})

test("Divide Test Two", () => {
    const v1 = new Slifer.Vector2(1, 1);
    const v2 = new Slifer.Vector2(0, 0);
    v1.divide(v2);

    expect(v1.getX()).toBe(Infinity);
    expect(v1.getY()).toBe(Infinity);
})

test("Divide By Scalar Test", () => {
    const v1 = new Slifer.Vector2(24,24);
    v1.divideByScalar(2);

    expect(v1.getX()).toBe(12);
    expect(v1.getY()).toBe(12);
})

test("Multiply By Scalar Test", () => {
    const v1 = new Slifer.Vector2(2,2);
    v1.multiplyByScalar(12);

    expect(v1.getX()).toBe(24);
    expect(v1.getY()).toBe(24);
})

test("Equality Test One", () => {
    const v1 = new Slifer.Vector2(12, 12);
    const v2 = new Slifer.Vector2(12, 12);

    expect(v1.isEqual(v2)).toBe(true);
})

test("Equality Test Two", () => {
    const v1 = new Slifer.Vector2(12, 12);
    const v2 = new Slifer.Vector2(12, 12.01);
    
    expect(v1.isEqual(v2)).toBe(false);
})

test("Normalize Test", () => {
    const v1 = new Slifer.Vector2(2, 4);
    v1.normalize();
    
    expect(v1.getX()).toBe(0.4472135954999579);
    expect(v1.getY()).toBe(0.8944271909999159);
})