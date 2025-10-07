import { loadLibraries, closeLibraries } from "../src/ffi.ts";
import { describe, it } from '@std/testing/bdd'
import { expect } from '@std/expect'

describe("Initialize SDL", () => {
    it("Initialize SDL successfully", async () => {
        const libs = await loadLibraries();
        const video = 0x00000020
        const init = libs.SDL.symbols.SDL_Init(video);
        expect(init).toBe(0);
        closeLibraries(libs);
    })

})

