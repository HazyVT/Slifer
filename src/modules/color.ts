class Color {

    private readonly value;

    constructor(red: number, green: number, blue: number) {
        this.value = ((red << 0) + (green << 8) + (blue << 16));
    }
}

export default Color;