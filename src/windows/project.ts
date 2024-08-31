import { libimage, libsdl, libttf } from "../ffi";
import { JSCallback, type Pointer, toArrayBuffer, ptr, read } from 'bun:ffi';
import Rectangle from "../modules/rectangle";
import Color from "../modules/color";
import { Database } from 'bun:sqlite';

// Create constants
const width = 640;
const height = 480;
const title = "Slifer Project Manager\x00";
const titlebarHeight = 64;

// Create variables
let running = true;
let mx: number = 0;
let my: number = 0;

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
const window = libsdl.symbols.SDL_CreateShapedWindow(Buffer.from(title), 0x2FFF0000, 0x2FFF0000, width, height, 0x00000004);

// Create the renderer
// Renderer is made with vsync
const renderer = libsdl.symbols.SDL_CreateRenderer(window, -1, 0x00000004);

const surface = libimage.symbols.IMG_Load(Buffer.from("./resources/image.png"));
const mode = new Uint32Array(2);
libsdl.symbols.SDL_SetWindowShape(window, surface, ptr(mode));

// Set render scale quality
const rsq = libsdl.symbols.SDL_SetHint(Buffer.from("SDL_RENDER_SCALE_QUALITY\x00"), Buffer.from("2"));
if (!rsq) throw `HINT SETTING FAILED`;


// Create hit test callback
const htCallback = (window: Pointer, area: Pointer, data: null) : number => {
    const dv = new DataView(toArrayBuffer(area, 0, 8));
    const mx = (dv.getUint8(1) * 255) + (dv.getUint8(0));
    const my = (dv.getUint8(5) * 255) + (dv.getUint8(4));

    if (my < titlebarHeight) {
        if (mx > yellowRect.x + yellowRect.width) {
            return 1;
        }

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

// Load draggie image
const draggieTexture = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/draggie.png\x00")));
const draggieRect = new Rectangle(257, -27, 126, 105);

// Buttons for window operators
const redCircleNormal = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/red/normal.png")));
const redCircleHover = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/red/hover.png")))
const redRect = new Rectangle(21, 26, 12, 12);
const yellowCircleNormal = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/yellow/normal.png")));
const yellowCircleHover = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/yellow/hover.png")));
const yellowRect = new Rectangle(45, 26, 12, 12);

// Create button
const createButton = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/create/normal.png")));
const createRect = new Rectangle(8, 72, 64, 24);
// Delete button
const deleteButton = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/buttons/delete/normal.png")));
const deleteRect = new Rectangle(80, 72, 64, 24);

// Management background
const managementBackground = libsdl.symbols.SDL_CreateTextureFromSurface(renderer, libimage.symbols.IMG_Load(Buffer.from("./resources/management-background.png")));
const managementRect = new Rectangle(8, 108, 624, 360);



// Loading fonts
const robotoFlex = libttf.symbols.TTF_OpenFont(Buffer.from("./resources/RobotoFlex.ttf"), 12);

// Create colors
const white = new Color(255, 255, 255);

// Create system cursors
const arrow = libsdl.symbols.SDL_CreateSystemCursor(0);
const ibeam = libsdl.symbols.SDL_CreateSystemCursor(1);
const hand = libsdl.symbols.SDL_CreateSystemCursor(11);


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
            // Mouse button down event
            case 1025:
                // Left Click
                if (eventArray[8] - 256 == 1) {
                    if (redRect.boundsCheck(mx, my)) {
                        running = false;
                    }

                    if (yellowRect.boundsCheck(mx, my)) {
                        libsdl.symbols.SDL_MinimizeWindow(window);
                    }
                }
                break;
            case 1024:
                mx = eventArray[10];
                my = eventArray[12];

                if (deleteRect.boundsCheck(mx, my)) {
                    libsdl.symbols.SDL_SetCursor(hand);
                    break;
                }

                if (createRect.boundsCheck(mx, my)) {
                    libsdl.symbols.SDL_SetCursor(hand);
                    break;
                }

                libsdl.symbols.SDL_SetCursor(arrow);
                break;
            case 768:
                break;
        }
    }

    // Draw the title bar
    libsdl.symbols.SDL_SetRenderDrawColor(renderer, 179, 232, 144);
    libsdl.symbols.SDL_RenderFillRect(renderer, titelbarRect.pointer);

    // Draw the logo
    libsdl.symbols.SDL_RenderCopy(renderer, draggieTexture, null, draggieRect.pointer);

    // Draw circles for window operations
    libsdl.symbols.SDL_RenderCopy(renderer, redRect.boundsCheck(mx, my) ? redCircleHover : redCircleNormal, null, redRect.pointer);
    libsdl.symbols.SDL_RenderCopy(renderer, yellowRect.boundsCheck(mx, my) ? yellowCircleHover : yellowCircleNormal, null, yellowRect.pointer);

    // Draw editor buttons
    libsdl.symbols.SDL_RenderCopy(renderer, createButton, null, createRect.pointer);
    libsdl.symbols.SDL_RenderCopy(renderer, deleteButton, null, deleteRect.pointer);


    // Draw management background
    libsdl.symbols.SDL_RenderCopy(renderer, managementBackground, null, managementRect.pointer);
    
    // Draw the renderer
    libsdl.symbols.SDL_RenderPresent(renderer);
}

libsdl.symbols.SDL_Quit();