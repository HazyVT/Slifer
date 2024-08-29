import { type Pointer } from 'bun:ffi';
import { libsdl } from '../ffi';

const centered = 0x2FFF0000;
const show = 0x00000004;

class Window {
  
    // Pointers
    private ptrWindow : Pointer | null = null;
    private ptrRenderer : Pointer | null = null;
    
    // Window Variables
    private width: number;
    private height: number;
    private isFullscreen: boolean;

    constructor(title: string, width: number, height: number) {
      this.ptrWindow = libsdl.symbols.SDL_CreateWindow(Buffer.from(title+"\x00"), centered, centered, width, height, show);
      if (this.ptrWindow == null) {
        throw `Window failed to be created`;
      }

      this.width = width;
      this.height = height;
      this.isFullscreen = false;

      this.ptrRenderer = libsdl.symbols.SDL_CreateRenderer(this.ptrWindow, -1, 4);
      if (this.ptrRenderer == null) {
        throw `Renderer failed to be created`;
      }
    }

    getWidth() {
      return this.width;
    }

    getHeight() {
      return this.height;
    }
}

export default Window;