import { ptr } from "bun:ffi";
import Vector2 from "./vector";

class Rectangle {
    private readonly pointer;
    public position: Vector2;
    public size: Vector2;

    constructor(position: Vector2, size: Vector2) {
        const arr = new Uint32Array(4);
        arr[0] = position.x;
        arr[1] = position.y;
        arr[2] = size.x;
        arr[3] = size.y;
        this.pointer = ptr(arr);
        this.position = position;
        this.size = size;
    }

    static empty() {
        return new Rectangle(new Vector2(0, 0), new Vector2(0, 0));
    }
}

export default Rectangle;
