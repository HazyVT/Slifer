import { type Pointer, ptr } from 'bun:ffi';
import { libsdl } from '../ffi';
import { Vector2 } from './vector';

export class Image {
    public readonly pointer: Pointer;
    public readonly size: Vector2;
    public flipH: boolean = false;

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

