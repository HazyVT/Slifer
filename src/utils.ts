export function logError(message: string) {
    console.error(`%cERROR: %c${message}`, "color: red;", "color: #FFF");
}

export function logWarning(message: string) {
    console.warn(`%cWARNING: %c${message}`, "color: yellow;", "color: #FFF;");
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

export type Buttons = 
    | 'left'
    | 'middle'
    | 'right'

export const buttonMap = new Map([
    ["left", 1],
    ["middle", 2],
    ["right", 4]
])
        
