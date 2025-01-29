import { libimage, libsdl, libttf } from "../ffi";
import { type Pointer, ptr } from "bun:ffi";
import Rectangle from "../engine/rectangle";
import Color from "../color";
import Vector2 from "../engine/vector";
import Renderer from "../engine/renderer";

class Graphics {
    static #instance: Graphics;

    static #fontPointer: Pointer;

    public static get instance() {
        if (!Graphics.#instance) {
            Graphics.#instance = new Graphics();
        }

        return Graphics.#instance;
    }
    /**
     * Slifers draw function. Used to draw everything to the screen.
     */
    public render() {
        libsdl.symbols.SDL_RenderPresent(Renderer.pointer);
    }

    /**
     * Create a new color. All values are from 0-255
     *
     * @param r red value
     * @param g green value
     * @param b blue value
     * @param a alpha value
     * @returns Color object
     */
    public makeColor(r: number, g: number, b: number, a: number) {
        const _color = new Color(r, g, b, a);
        return _color;
    }

    /**
     * Sets the background of the window to a color of choice.
     *
     * Make sure this is put in the top level of the while loop
     * as it will clear the renderer.
     *
     * @param color Color object. Make using Slifer.Graphics.makeColor
     */
    public setBackground(color: Color) {
        libsdl.symbols.SDL_SetRenderDrawColor(
            Renderer.pointer,
            color.r,
            color.g,
            color.b,
            color.a
        );
        libsdl.symbols.SDL_RenderClear(Renderer.pointer);
    }

    /**
     * Loads a new image
     *
     * @param path string path to image
     * @returns Image ready to draw
     */
    public loadImage(path: string): Image {
        const _path = Buffer.from(path + "\x00");
        const surface = libimage.symbols.IMG_Load(_path);
        if (surface == null) throw `Image failed to load`;
        const texture = libsdl.symbols.SDL_CreateTextureFromSurface(
            Renderer.pointer,
            surface
        );
        if (texture == null) throw `Image failed to be created`;
        return new Image(texture);
    }

    /**
     * Method to draw to the screen simply
     *
     * @param image Image object to draw. Made using Slifer.Graphics.loadImage
     * @param position position to draw the image
     *
     */
    public draw(image: Image, position: Vector2) {
        const dstRect = new Uint32Array(4);
        dstRect[0] = position.x;
        dstRect[1] = position.y;
        dstRect[2] = image.size.x;
        dstRect[3] = image.size.y;

        libsdl.symbols.SDL_RenderCopy(
            Renderer.pointer,
            (image as any).pointer,
            null,
            dstRect
        );
    }

    /*
     * Method to draw to the screen with extended arguments
     *
     * @param image Image object to draw. Made using Slifer.Graphics.loadImage
     * @param position Position to draw the image.
     * @param rotation Optional argument angle of rotation
     * @param scale Optional What to multiply the width and height of image by
     */
    public drawEx(
        image: Image,
        position: Vector2,
        rotation?: number,
        scale?: Vector2
    ) {
        // Define destination rect
        const dstRect = new Uint32Array(4);
        dstRect[0] = position.x;
        dstRect[1] = position.y;
        dstRect[2] = image.size.x * (scale ? scale.x : 1);
        dstRect[3] = image.size.y * (scale ? scale.y : 1);

        // Draw to screen
        libsdl.symbols.SDL_RenderCopyEx(
            Renderer.pointer,
            image.pointer,
            null,
            ptr(dstRect),
            rotation ? rotation : 0,
            null,
            null
        );
    }
}

class Image {
    public readonly pointer: Pointer;
    public readonly size: Vector2;

    constructor(texture: Pointer) {
        this.pointer = texture;

        const _wArr = new Uint32Array(1);
        const _hArr = new Uint32Array(1);

        libsdl.symbols.SDL_QueryTexture(
            texture,
            null,
            null,
            ptr(_wArr),
            ptr(_hArr)
        );

        this.size = new Vector2(_wArr[0], _hArr[0]);
    }
}

/** @internal */
export default Graphics;
