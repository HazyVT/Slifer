import { ptr } from "bun:ffi";
import { libmixer } from "../ffi";

class Audio {
    static #instance: Audio;

    private constructor() {}

    public static get instance() {
        if (!Audio.#instance) Audio.#instance = new Audio();

        return Audio.#instance;
    }

    public loadAudio(path: string): AudioSource {
        return new AudioSource(path);
    }
}

export class AudioSource {
    public readonly pointer;

    constructor(path: string) {
        const audiomix = libmixer.symbols.Mix_LoadWAV(
            Buffer.from(path + "\x00")
        );

        if (audiomix == null) throw `Failed to open wav file`;
        this.pointer = audiomix;
    }

    public play() {
        libmixer.symbols.Mix_PlayChannel(-1, this.pointer, 0);
    }

    public destroy() {
        libmixer.symbols.Mix_FreeChunk(this.pointer);
    }
}

export default Audio;
