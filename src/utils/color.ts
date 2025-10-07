class Color {
    readonly red: number;
    readonly green: number;
    readonly blue: number;

    /**
     * 
     * @param red - value of red from 0 - 255
     * @param green - value of green from 0 - 255
     * @param blue - value of blue from 0 - 255
     */
    constructor(red: number, green: number, blue: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
}

export function colorToNumber(color: Color) {
    return ((color.red << 0) + (color.green << 8) + (color.blue << 16));
}

export default Color;