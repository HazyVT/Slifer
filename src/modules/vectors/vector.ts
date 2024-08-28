export interface Vector<T> {
    /**
     * Add the passed vector into the current vector
     * 
     */
    add(vector: T): void;

    /**
     * Subtract the passed vector from the current vector
     * 
     */
    subtract(vector: T) : void;

    /**
     * Multiply this vector by the passed vector
     */
    multiply(vector: T) : void;

    /**
     * Devide this vector by the passed vector
     */
    divide(vector: T) : void;

    /**
     * Multiply this vector by a scalar
     */
    multiplyByScalar(scalar: number) : void;

    /**
     * Devide this vector by a scalar
     */
    divideByScalar(scalar: number) : void;

    /**
     * Get X
     */
    getX() : number;

    /**
     * Get Y
     */
    getY() : number;

    /**
     * Set X
     */
    setX(x: number) : void;

    /**
     * Set Y
     */
    setY(y: number) : void;

    /**
     * Return true if passed vector is equal to this vector
     */
    isEqual(vector: T) : boolean;

    /**
     * Normalize this vector
     */
    normalize() : void;

    /**
     * Method gets the magnitude of the vector
     * @returns length of vector
     */
    magnitude() : number;

    
}