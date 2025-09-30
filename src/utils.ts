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

export type Keys =
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "0"
    | "space"
    | "tabspace"
    | "left shift"
    | "right shift"
    | "left ctrl"
    | "escape"
    | "backspace"
    | "."
    | "return";