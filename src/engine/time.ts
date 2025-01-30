import { libsdl } from "../ffi";

class Time {
    static #instance: Time;

    private lastframe: number = 0;
    private firstFrame: number = 0;

    private constructor() {}

    public static get instance() {
        if (!Time.#instance) {
            Time.#instance = new Time();
        }

        return Time.#instance;
    }

    public init() {
        this.firstFrame = Number(libsdl.symbols.SDL_GetPerformanceCounter());
    }

    public calcDelta(): number {
        this.lastframe = this.firstFrame;
        this.firstFrame = Number(libsdl.symbols.SDL_GetPerformanceCounter());
        const deltaTime =
            ((this.firstFrame - this.lastframe) * 10) /
            Number(libsdl.symbols.SDL_GetPerformanceFrequency());

        return deltaTime;
    }
}

export default Time;
