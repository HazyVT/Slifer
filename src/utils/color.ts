class Color {
    readonly red: number;
    readonly green: number;
    readonly blue: number;

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