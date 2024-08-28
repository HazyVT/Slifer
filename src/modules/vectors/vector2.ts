import type { Vector } from "./vector";

class Vector2 implements Vector<Vector2>{
    private x;
    private y;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * 
     * @param vector2
     */
    add(vector: Vector2) : void {
        this.x += vector.x;
        this.y += vector.y;
    }

    /**
     * 
     * @param vector2 
     */
    subtract(vector: Vector2) : void {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    magnitude(): number {
        const x = this.x;
        const y = this.y;
        return Math.sqrt(x * x + y * y);
        
    }

    multiply(vector: Vector2): void {
        this.x *= vector.x;
        this.y *= vector.y;
    }

    divide(vector: Vector2) {
        this.x /= vector.x;
        this.y /= vector.y;
    }

    multiplyByScalar(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }

    divideByScalar(scalar: number) {
        this.x = this.x / scalar;
        this.y = this.y / scalar;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    setX(x: number): void {
        this.x = x;
    }

    setY(y: number): void {
        this.y = y;
    }

    isEqual(vector: Vector2): boolean {
        return (this.x == vector.x && this.y == vector.y);
    }

    normalize() {
        this.divideByScalar(this.magnitude());
    }
}


export default Vector2;