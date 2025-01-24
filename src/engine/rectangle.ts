import { ptr } from "bun:ffi";

class Rectangle {
    private readonly pointer;
    public x;
    public y;
    public width;
    public height;

    constructor(x: number, y: number, width: number, height: number) {
        const arr = new Uint32Array(4);
        arr[0] = x;
        arr[1] = y;
        arr[2] = width;
        arr[3] = height;
        this.pointer = ptr(arr);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export default Rectangle;
