import { libmixer } from "../ffi";

/** @internal */
export default class Audio {
    private readonly pointer;

    constructor(path: string) {
        const audiomix = libmixer.symbols.Mix_LoadWAV(
            //@ts-expect-error Buffer error
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