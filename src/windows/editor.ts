import { libimage, libsdl, libttf } from "../ffi";
import { ptr, type Pointer, toArrayBuffer, JSCallback } from 'bun:ffi';
import Rectangle from "../modules/rectangle";
import Color from "../modules/color";

// Variables
let title = "PROJECT NAME";
let width = 1280;
let height = 720;
const titlebarHeight = 48;
let running = true;
let mx = 0;
let my = 0;

// Creating the slifer project window
// Initialization
const baseinit = libsdl.symbols.SDL_Init(0x00000020);
if (baseinit != 0) throw `Initialization failed`;

const imginit = libimage.symbols.IMG_Init(3);
if (imginit != 3) throw `Initialization failed`;

const ttfinit = libttf.symbols.TTF_Init();
if (ttfinit != 0) throw `Initialization failed`;

// Create the window
// Window is made borderless for custom titlebar
const window = libsdl.symbols.SDL_CreateWindow(Buffer.from(title), 0x2FFF0000, 0x2FFF0000, width, height, 0x00000010);

// Create the renderer
// Renderer is made with vsync
const renderer = libsdl.symbols.SDL_CreateRenderer(window, -1, 0x00000004);

const rsq = libsdl.symbols.SDL_SetHint(Buffer.from("SDL_RENDER_SCALE_QUALITY\x00"), Buffer.from("2"));
if (!rsq) throw `HINT SETTING FAILED`;

// Create hit test callback
const htCallback = (window: Pointer, area: Pointer, data: null) : number => {
    const dv = new DataView(toArrayBuffer(area, 0, 8));
    const mx = (dv.getUint8(1) * 255) + (dv.getUint8(0));
    const my = (dv.getUint8(5) * 255) + (dv.getUint8(4));

    if (my < titlebarHeight) {
        if (mx > yellowRect.x + yellowRect.width) return 1;
    }
    
    return 0;
}

// Set the window hit callback
const htfunc = new JSCallback(htCallback, {
    args: ['pointer', 'pointer', 'pointer'],
    returns: 'int'
})
libsdl.symbols.SDL_SetWindowHitTest(window, htfunc, null);

// Create title bar react
const titelbarRect = new Rectangle(0, 0, width, titlebarHeight);

// Buttons for window operators
const redCircleNormal = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/red/normal.png")));
const redCircleHover = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/red/hover.png")))
const redRect = new Rectangle(32, 18, 12, 12);
const yellowCircleNormal = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/yellow/normal.png")));
const yellowCircleHover = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/yellow/hover.png")));
const yellowRect = new Rectangle(56, 18, 12, 12);
let redIsHovered = false;
let yellowIsHovered = false;

// Create draggie
const draggie = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("resources/draggie-editor.png")));
const draggieRect = new Rectangle(1204, 0, 95, 60);

// Create task bar
const taskbarRect = new Rectangle(12, 69, 1256, 36);
// Create file explorer
const fileExplorerRect = new Rectangle(12, 117, 100, 591);
// Create editor window
const editorWindowRect = new Rectangle(124, 120, 1144, 588);

// Load needed colors
const white = new Color(56,56,56);

// Load font
const font = libttf.symbols.TTF_OpenFont(Buffer.from("./resources/RobotoFlex.ttf"), 24);
const wArr = new Uint32Array(1);
const hArr = new Uint32Array(1);
libttf.symbols.TTF_SizeText(font, Buffer.from(title), ptr(wArr), ptr(hArr));
const titleRect = new Rectangle(640 - (wArr[0] / 2), (titlebarHeight/2) - (hArr[0] / 2), wArr[0], hArr[0]);
const titleTexture = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libttf.symbols.TTF_RenderText_Solid(font, Buffer.from(title), white.value));

while (running) {
    // Clear the renderer
    libsdl.symbols.SDL_SetRenderDrawColor(renderer, 36, 36, 36, 255);
    libsdl.symbols.SDL_RenderClear(renderer);
    
    // Handle events
    const eventArray = new Uint16Array(32);
    const isEvent = libsdl.symbols.SDL_PollEvent(ptr(eventArray));

    if (isEvent) {
        switch (eventArray[0]) {
            // Quit event
            case 256:
                running = false;
                break;
            case 1025:
                if (redRect.boundsCheck(mx, my)) {
                    running = false;
                }

                if (yellowRect.boundsCheck(mx, my)) {
                    libsdl.symbols.SDL_MinimizeWindow(window);
                }

                break;
            case 1024:
                mx = eventArray[10];
                my = eventArray[12];
                break;
        }
    }

    // Draw the titlebar
    libsdl.symbols.SDL_SetRenderDrawColor(renderer, 179, 232, 144);
    libsdl.symbols.SDL_RenderFillRect(renderer, titelbarRect.pointer)

    // Draw tite bar buttons
    libsdl.symbols.SDL_RenderCopy(renderer, redRect.boundsCheck(mx,my) ? redCircleHover : redCircleNormal, null, redRect.pointer);
    libsdl.symbols.SDL_RenderCopy(renderer, yellowRect.boundsCheck(mx, my) ? yellowCircleHover : yellowCircleNormal, null, yellowRect.pointer);

    // Draw draggie
    libsdl.symbols.SDL_RenderCopy(renderer, draggie, null, draggieRect.pointer);

    // Draw taskbar
    libsdl.symbols.SDL_SetRenderDrawColor(renderer, 56, 56, 56);
    libsdl.symbols.SDL_RenderFillRect(renderer, taskbarRect.pointer);

    // Draw file explorer
    libsdl.symbols.SDL_RenderFillRect(renderer, fileExplorerRect.pointer);

    // Draw editor window
    libsdl.symbols.SDL_RenderFillRect(renderer, editorWindowRect.pointer);

    // Write title
    libsdl.symbols.SDL_RenderCopy(renderer, titleTexture, null, titleRect.pointer);

    // Render to screen
    libsdl.symbols.SDL_RenderPresent(renderer);
}