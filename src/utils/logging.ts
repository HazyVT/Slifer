export function logError(message: string) {
    console.error(`%cERROR: %c${message}`, "color: red;", "color: #FFF");
}

export function logWarning(message: string) {
    console.warn(`%cWARNING: %c${message}`, "color: yellow;", "color: #FFF;");
}