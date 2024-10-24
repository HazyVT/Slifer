import { libimage, libsdl, libttf } from "./ffi";
import Global from "./global";
import { ptr } from "bun:ffi";
import Graphics from "./modules/graphics";
import Keyboard from "./modules/keyboard";
import Mouse from "./modules/mouse";
import { version } from '../package.json';

//@ts-expect-error
const fontFile = await import("../Jacquard_12/Jacquard12-Regular.ttf");

/** @internal */
class Window {
  public width: number;
  public height: number;
  public title: string;

  constructor(title: string, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.title = title;
  }

  setSize(width: number, height: number) : void {
    libsdl.symbols.SDL_SetWindowSize(Global.ptrWindow, width, height);
  }

  setTitle(title: string) : void {
    libsdl.symbols.SDL_SetWindowTitle(Global.ptrWindow, Buffer.from(title+'\x00'));
  }

  setFullscreen(flag: boolean) : void {
    libsdl.symbols.SDL_SetWindowFullscreen(Global.ptrWindow, Number(flag));
  }

  centerWindow() : void {
    libsdl.symbols.SDL_SetWindowPosition(Global.ptrWindow, 0x2FFF0000, 0x2FFF0000);
  }

  setPosition(x: number, y: number) : void {
    libsdl.symbols.SDL_SetWindowPosition(Global.ptrWindow, x, y);
  }
}

/** @interal */
export class SliferClass {
  isRunning: boolean = true;

  // Modules
  Graphics = new Graphics();
  Keyboard = new Keyboard();
  Mouse = new Mouse();

  constructor() {
    const baseInit = libsdl.symbols.SDL_Init(0x00000020);
    if (baseInit != 0) throw `SDL failed to initialize`;

    const imageInit = libimage.symbols.IMG_Init(3);
    if (imageInit != 3) throw `SDL Image failed to initialize`;

    const ttfInit = libttf.symbols.TTF_Init();
    if (ttfInit != 0) throw `SDL TTF failed to initialize`;

    /*
    if (process.platform == "darwin") {
      const tempFont = libttf.symbols.TTF_OpenFont(
        Buffer.from("/System/Library/Fonts/SFNSMono.ttf"),
        12,
      );
      if (tempFont == null) throw `Default font loading failed`;
      Global.ptrFont = tempFont;
    } else if (process.platform == "linux") {
      const tempFont = libttf.symbols.TTF_OpenFont(
        Buffer.from("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"),
        12,
      );
      if (tempFont == null) throw `Default font loading failed`;
      Global.ptrFont = tempFont;
    }
    */

    

    const tempFont = libttf.symbols.TTF_OpenFont(
      Buffer.from(fontFile.default), 24);
      if (tempFont == null) throw `Default font loading failed`;
      Global.ptrFont = tempFont;
  }

  /**
   * @param title Title of window
   * @param width Width of window
   * @param height Height of window
   */
  createWindow(title: string, width: number, height: number): Window {
    // Creating cstring buffer from string
    const _title = Buffer.from(title + "\x00");

    // Creating window pointer
    const _win = libsdl.symbols.SDL_CreateWindow(
      _title,
      0x2FFF0000,
      0x2FFF0000,
      width,
      height,
      0,
    );
    if (_win == null) throw `Window creation failed`;
    Global.ptrWindow = _win;

    // Creating renderer pointer
    const _ren = libsdl.symbols.SDL_CreateRenderer(Global.ptrWindow, -1, 0);
    if (_ren == null) throw `Renderer Creation failed`;
    Global.ptrRenderer = _ren;

    return new Window(title, width, height);
  }

  /**
   * @returns if the window should close
   */
  shouldClose(): boolean {
    // Clear the renderer
    libsdl.symbols.SDL_RenderClear(Global.ptrRenderer);

    // Poll Events
    const eventArray = new Uint16Array(32);
    const isEvent = libsdl.symbols.SDL_PollEvent(ptr(eventArray));

    if (isEvent) {
      switch (eventArray[0]) {
        // Quit event
        case 256:
          this.isRunning = false;
          break;
        // Keydown event
        case 768:
          const _dscancode = eventArray[8];
          const _dkey = libsdl.symbols.SDL_GetKeyFromScancode(_dscancode);
          const _dname = libsdl.symbols.SDL_GetKeyName(_dkey);
          Keyboard.setKeyDown(_dname.toString().toLowerCase());
          break;
        // Keyup event
        case 769:
          const _uscancode = eventArray[8];
          const _ukey = libsdl.symbols.SDL_GetKeyFromScancode(_uscancode);
          const _uname = libsdl.symbols.SDL_GetKeyName(_ukey);
          Keyboard.setKeyUp(_uname.toString().toLowerCase());
          break;
        // Mouse down event
        case 1025:
          const _dbtn = eventArray[8] - 256;
          Mouse.setButtonDown(_dbtn);
          break;
        // Mouse up event
        case 1026:
          const _ubtn = eventArray[8];
          Mouse.setButtonUp(_ubtn);
          break;
      }
    }

    return !this.isRunning;
  }

  /**
   * Slifers quit method
   */
  quit() {
    libttf.symbols.TTF_CloseFont(Global.ptrFont);
    libsdl.symbols.SDL_DestroyRenderer(Global.ptrRenderer);
    libsdl.symbols.SDL_DestroyWindow(Global.ptrWindow);
    libsdl.symbols.SDL_Quit();
  }

  getVersion() {
    return version;
  }
}

export class Vector2 {
  x;
  y;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Rectangle {

  private readonly pointer;
  readonly x;
  readonly y;
  readonly width;
  readonly height;

  constructor(x: number, y: number, width: number, height: number) {
    const arr = new Uint32Array(4);
    arr[0] = x;
    arr[1] = y;
    arr[2] = width;
    arr[3] = height;
    this.pointer = ptr(arr);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}