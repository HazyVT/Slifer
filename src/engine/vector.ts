class Vector2 {
    public x;
    public y;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Creates a Vector2 with the components 1,1
     */
    static one() {
        return new Vector2(1, 1);
    }

    /**
     * Creates a Vector2 with the components 1,0
     */
    static unitX() {
        return new Vector2(1, 0);
    }

    /**
     * Creates a Vector2 with the components 0,1
     */
    static unitY() {
        return new Vector2(0, 1);
    }

    /**
     * Creates a vector2 with component 0,0
     */
    static zero() {
        return new Vector2(0, 0);
    }

    /**
     * Adds two vectors together
     *
     * @param vec1 Vector2 object
     * @param vec2 Vector2 object
     */
    static add(vec1: Vector2, vec2: Vector2) {
        return new Vector2(vec1.x + vec2.x, vec1.y + vec2.y);
    }
}

export default Vector2;
