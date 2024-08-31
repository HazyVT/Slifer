import { type Pointer, ptr } from 'bun:ffi'; 

class Rectangle {

    public pointer : Pointer;
    public x;
    public y;
    public width;
    public height;

    constructor(x: number, y: number, width: number, height: number) {
        const _rect = new Uint32Array(4);
        _rect[0] = x;
        _rect[1] = y;
        _rect[2] = width;
        _rect[3] = height;
        this.pointer = ptr(_rect);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    boundsCheck(x: number, y: number) : boolean {
        if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
            return true;
        }

        return false;
    }
}

export default Rectangle;