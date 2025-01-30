import { ptr } from "bun:ffi";
import { Vector2 } from "./vector";

export class Rectangle {
    public readonly pointer;
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

    public isColliding(rectangle: Rectangle) : boolean {
    	if (
    		this.position.x < rectangle.position.x + rectangle.size.x &&
    		this.position.x + this.size.x > rectangle.position.x &&
    		this.position.y < rectangle.position.y + rectangle.size.y &&
    		this.position.y + this.size.y > rectangle.position.y
    	) {
    		return true;
    	}

    	return false;
    }
}

