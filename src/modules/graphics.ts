import { libimage, libsdl, libttf } from "../ffi";
import { type Pointer, ptr } from "bun:ffi";
import Rectangle from "../engine/rectangle";
import Color from "../color";
import Vector2 from "../engine/vector";
import Renderer from "../engine/renderer";

//@ts-expect-error Font file is not a type declaration
const defaultFontFile = await import("../Jost-Bold.ttf");

class Graphics {
    static #instance: Graphics;

    static #fontPointer: Pointer;

    public static get instance() {
        if (!Graphics.#instance) {
            Graphics.#instance = new Graphics();
        }

        return Graphics.#instance;
    }

    public static get font() {
        if (!Graphics.#fontPointer) {
            const tempFontPointer = libttf.symbols.TTF_OpenFont(
                Buffer.from(defaultFontFile.default + "\x00"),
                24
            );

            if (tempFontPointer == null) throw `Font Failed to Load`;
        }

        return Graphics.#fontPointer;
    }

    /**
     * Slifers draw function. Used to draw everything to the screen.
     */
    render() {
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
    makeColor(r: number, g: number, b: number, a: number) {
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
    setBackground(color: Color) {
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
    loadImage(path: string): Image {
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
     * @param image Image object to draw. Made using Slifer.Graphics.loadImage
     * @param position position to draw the image
     *
     */
    draw(image: Image, position: Vector2) {
        const dstRect = new Uint32Array(4);
        dstRect[0] = position.x;
        dstRect[1] = position.y;
        dstRect[2] = image.width;
        dstRect[3] = image.height;

        libsdl.symbols.SDL_RenderCopy(
            Renderer.pointer,
            (image as any).pointer,
            null,
            dstRect
        );
    }

    /**
     * Method to draw the image to the screen with extended arguments
     *
     * @param image Image object to draw. Made using Slifer.Graphics.loadImage
     * @param position position to draw the image
     * @param y y position to draw image
     * @param rotation (optional) rotation of image
     * @param xs (optional) scale of x axis
     * @param ys (optional) scale of y axis
     * @param flip (optional) horizontal flip
     */
    drawEx(
        image: Image,
        position: Vector2,
        clipRectangle?: Rectangle | null,
        rotation?: number,
        xs?: number,
        ys?: number,
        flip?: true
    ) {
        const _dest = new Uint32Array(4);
        let srcRect: null | Uint32Array = null;

        if (clipRectangle != null) {
            srcRect = new Uint32Array(4);
            srcRect[0] = clipRectangle.position.x;
            srcRect[1] = clipRectangle.position.y;
            srcRect[2] = clipRectangle.size.x;
            srcRect[3] = clipRectangle.size.y;
        }

        _dest[0] = position.x;
        _dest[1] = position.y;
        _dest[2] = image.width * (xs ? xs : 1);
        _dest[3] = image.height * (ys ? ys : 1);
        const _center = new Uint32Array(2);
        _center[0] = _dest[2] / 2;
        _center[1] = _dest[3] / 2;
        libsdl.symbols.SDL_RenderCopyEx(
            Renderer.pointer,
            (image as any).pointer,
            srcRect,
            ptr(_dest),
            rotation ? rotation : 0,
            ptr(_center),
            flip ? Number(flip) : 0
        );
    }
}

class Image {
    private pointer;
    public readonly width;
    public readonly height;

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

        this.width = _wArr[0];
        this.height = _hArr[0];
    }
}

/** @internal */
export default Graphics;
