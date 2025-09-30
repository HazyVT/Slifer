export function logError(message: string) {
    console.error(`%cERROR: ${message}`, "color: red;");
}

export class Color {
    readonly red: number;
    readonly green: number;;
    readonly blue: number;;
    readonly alpha: number;;

    constructor(red: number, green: number, blue: number, alpha: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}