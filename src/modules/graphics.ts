import { libimage, libsdl, libttf } from "../ffi";
import Global from "../global";
import { type Pointer, ptr } from "bun:ffi";
import Rectangle from "../engine/rectangle";
import Color from "../color";
import Vector2 from "../engine/vector";

/** @internal */
class Graphics {
    /**
     * Slifers draw function. Used to draw everything to the screen.
     */
    render() {
        libsdl.symbols.SDL_RenderPresent(Global.ptrRenderer);
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
            Global.ptrRenderer,
            color.r,
            color.g,
            color.b,
            color.a
        );
        libsdl.symbols.SDL_RenderClear(Global.ptrRenderer);
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
            Global.ptrRenderer,
            surface
        );
        if (texture == null) throw `Image failed to be created`;
        return new Image(texture);
    }

    draw(image: Image, position: Vector2) {}

    /**
     * Method to draw the image to the screen
     *
     * @param image Image object to draw. Made using Slifer.Graphics.loadImage
     * @param x x position to draw image
     * @param y y position to draw image
     * @param rotation (optional) rotation of image
     * @param xs (optional) scale of x axis
     * @param ys (optional) scale of y axis
     * @param flip (optional) horizontal flip
     */
    drawEx(
        image: Image,
        position: Vector2,
        clipRectangle?: Rectangle,
        rotation?: number,
        xs?: number,
        ys?: number,
        flip?: true
    ) {
        const _dest = new Uint32Array(4);
        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        let srcRect: null | Uint32Array = null;

        if (clipRectangle == undefined) {
            libsdl.symbols.SDL_QueryTexture(
                (image as any).pointer,
                null,
                null,
                ptr(wArr),
                ptr(hArr)
            );
        } else {
            srcRect = new Uint32Array(4);
            srcRect[0] = clipRectangle.x;
            srcRect[1] = clipRectangle.y;
            srcRect[2] = clipRectangle.width;
            srcRect[3] = clipRectangle.height;
            wArr[0] = clipRectangle.width;
            hArr[0] = clipRectangle.height;
        }

        _dest[0] = position.x;
        _dest[1] = position.y;
        _dest[2] = wArr[0] * (xs ? xs : 1);
        _dest[3] = hArr[0] * (ys ? ys : 1);
        const _center = new Uint32Array(2);
        _center[0] = _dest[2] / 2;
        _center[1] = _dest[3] / 2;
        libsdl.symbols.SDL_RenderCopyEx(
            Global.ptrRenderer,
            (image as any).pointer,
            srcRect,
            ptr(_dest),
            rotation ? rotation : 0,
            ptr(_center),
            flip ? Number(flip) : 0
        );
    }

    /**
     * Method to draw text to the screen
     *
     * @param text the string of text to print
     * @param x x position
     * @param y y position
     * @param color color of text. Made using Slifer.Graphics.makeColor.
     */
    print(text: string, x: number, y: number, color: Color) {
        // Create text buffer
        const textBuffer = Buffer.from(text + "\x00");

        // Get width and height of text
        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        libttf.symbols.TTF_SizeText(
            Global.ptrFont,
            textBuffer,
            ptr(wArr),
            ptr(hArr)
        );

        // Define color
        const _col = (color.r << 0) + (color.g << 8) + (color.b << 16);

        // Create texture
        const surface = libttf.symbols.TTF_RenderText_Solid(
            Global.ptrFont,
            textBuffer,
            _col
        );
        if (surface == null) throw `Surface creation failed on print`;
        const texture = libsdl.symbols.SDL_CreateTextureFromSurface(
            Global.ptrRenderer,
            surface
        );
        if (texture == null) throw `Texture creation failed on print`;

        // Create destination
        const destArr = new Uint32Array(4);
        destArr[0] = x;
        destArr[1] = y;
        destArr[2] = wArr[0];
        destArr[3] = hArr[0];

        // Draw text
        libsdl.symbols.SDL_RenderCopy(
            Global.ptrRenderer,
            texture,
            null,
            ptr(destArr)
        );
    }

    /**
     * Sets the font to a ttf file in your project
     *
     * @param path relative path to font
     * @param pt size of text
     */
    setFont(path: string, pt: number) {
        const tempFont = libttf.symbols.TTF_OpenFont(
            Buffer.from(path + "\x00"),
            pt
        );
        if (tempFont == null) throw `Font loading failed`;
        Global.ptrFont = tempFont;
    }
}

class Image {
    private pointer;

    constructor(texture: Pointer) {
        this.pointer = texture;
    }
}

/** @internal */
export default Graphics;
