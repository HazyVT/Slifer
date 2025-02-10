import Vector2 from "./vector2";
import { ptr, type Pointer } from 'bun:ffi';

/** @internal */
export default class Rectangle {
    
    public readonly position;
    public readonly size;

    constructor(position: Vector2, size: Vector2) {
        this.position = position;
        this.size = size;
    }

	static empty() : Rectangle {
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