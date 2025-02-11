/** @internal */
export default class Vector2 {
    public x;
    public y;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static one() : Vector2 {
        return new Vector2(1, 1);
    }

    static unitX() : Vector2 {
        return new Vector2(1, 0);
    }

    static unitY() : Vector2 {
        return new Vector2(0, 1);
    }

    static zero() : Vector2 {
        return new Vector2(0, 0);
    }
}   