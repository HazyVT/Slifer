import { sdl } from "./ffi.ts";
import { type Keys, type Buttons, buttonMap } from "./utils.ts";
import Image from "./utils/image.ts";
import Color from "./utils/color.ts";
import Window from "./window.ts";

class Slifer {

    public Window = Window;
    public Color = Color;
    public Image = Image;

    // Event codes
    private QUIT = 256;

    static window: Deno.PointerValue;
    static renderer: Deno.PointerValue;
    static shouldLog: boolean = true
    static running: boolean = true;


    private static keyMap: Map<string, -1 | 0 | 1 | 2> = new Map();
    private static mouseMap: Map<string, -1 | 0 | 1 | 2> = new Map();
    
    private static backgroundColor: Color = new Color(0,0,0);
    private static mouse: {x: number, y: number};

    static log(text: string) {
        if (this.shouldLog) {
            console.log(`%cSlifer: %c${text}`, "color: green;", "color: #FFF");
        }
    }

    /**
     * 
     * @param flag - Should slifer log default logs. False will turn default logs off
     */
    setLog(flag: boolean): void {
        Slifer.shouldLog = flag
    }

    /**
     * 
     * @returns whether Slifer is running
     */
    isRunning(): boolean {
        // Draw background color
        sdl.SDL_SetRenderDrawColor(
            Slifer.renderer,
            Slifer.backgroundColor.red,
            Slifer.backgroundColor.green,
            Slifer.backgroundColor.blue,
            255
        );

        // Clear renderer for drawing
        sdl.SDL_RenderClear(Slifer.renderer);

        // Handle window events
        const eventArr = new Uint16Array(32);
        const event = Deno.UnsafePointer.of(eventArr);
        while (sdl.SDL_PollEvent(event)) {
            const view = new Deno.UnsafePointerView(event!);
            const type = view.getUint32();

            // Quit event
            if (type == this.QUIT) Slifer.running = false;
        }

        // Handle keyboard 
        const keyStates = sdl.SDL_GetKeyboardState(null);
        const keyStatesView = new Deno.UnsafePointerView(keyStates!);
        for (let i = 0; i < 69; i++) {
            const code = sdl.SDL_GetKeyFromScancode(i);
            const namePointer = sdl.SDL_GetKeyName(code);
            const nameView = new Deno.UnsafePointerView(namePointer!);
            const name = nameView.getCString().toLowerCase();

            if (keyStatesView.getUint8(i) == 1) {
                const state = Slifer.keyMap.get(name);
                if (state == undefined || state == 0) {
                    Slifer.keyMap.set(name, 1);
                } else if (state == 1) {
                    Slifer.keyMap.set(name, 2);
                }
            } else {
                const state = Slifer.keyMap.get(name);
                if (state == 1 || state == 2) {
                    Slifer.keyMap.set(name, -1);
                } else {
                    Slifer.keyMap.set(name, 0);
                }
            }
        }

        // Handle mouse events
        const mx = new Uint32Array(1);
        const my = new Uint32Array(2);

        const mouseState = sdl.SDL_GetMouseState(Deno.UnsafePointer.of(mx), Deno.UnsafePointer.of(my));
        

        if (mouseState != 0) {
            for (const [k, v] of buttonMap) {
                const isPressed = mouseState & v;
                const state = Slifer.mouseMap.get(k);
                if (isPressed) {
                    if (state == undefined || state == 0) {
                        Slifer.mouseMap.set(k, 1);
                    }
                    else if (state == 1) {
                        Slifer.mouseMap.set(k, 2);
                    }
                } else {
                    if (state == undefined || state == -1) {
                        Slifer.mouseMap.set(k, 0);
                    }
                    else if (state > 0) {
                        Slifer.mouseMap.set(k, -1);
                    }
                }

            }
        } else {
            for (const [k, _v] of buttonMap) {
                const state = Slifer.mouseMap.get(k);
                if (state == undefined || state == -1) {
                    Slifer.mouseMap.set(k, 0);
                }
                else if (state > 0) {
                    Slifer.mouseMap.set(k, -1);
                }
            }
        }
        
        Slifer.mouse = {x: mx[0], y: my[0]};

        return Slifer.running;
    }

    /**
     * 
     * @param color - Color object to set the background color to.
     */
    setBackground(color: Color): void {
        Slifer.backgroundColor = color;
    }

    /**
     * Method to render everything drawn to the screen
     */
    render(): void {
        sdl.SDL_RenderPresent(Slifer.renderer);
    }

    /**
     * 
     * @param key - string of which key to get
     * @returns if that key is being held down.
     */
    isKeyDown(key: Keys) : boolean {
        const state = Slifer.keyMap.get(key);
        if (state == undefined || state == 0) {
            return false;
        }

        return true;
    }


    /**
     * 
     * @param button - string of which button to check
     * @returns if that button is being held down
     */
    isMouseButtonDown(button: Buttons) : boolean {
        const state = Slifer.mouseMap.get(button);
        if (state == undefined || state == 0) {
            return false;
        }

        return true;
    }

    /**
     * 
     * @param key - string of which key to get
     * @returns if that key has been pressed in the last frame.
     */
    isKeyPressed(key: Keys) : boolean {
        const state = Slifer.keyMap.get(key);
        if (state == 1) return true;

        return false;
    }

    /**
     * 
     * @param button - string of which button to get
     * @returns if that button has been pressed in the last frame.
     */
    isMouseButtonPressed(button: Buttons) : boolean {
        const state = Slifer.mouseMap.get(button);
        if (state == 1) return true;

        return false;
    }
    

    /**
     * 
     * @param key - string of which key to get
     * @returns if that key has been released in the last frame
     */
    isKeyReleased(key: Keys) : boolean {
        const state = Slifer.keyMap.get(key);
        if (state == -1) return true;

        return false;
    }

    /**
     * 
     * @param button - string of which button to get
     * @returns if that button has been released in the last frame
     */
    isMouseButtonReleased(button: Buttons) : boolean {
        const state = Slifer.mouseMap.get(button);
        if (state == -1) return true;

        return false;
    }

    /**
     * Close running instance of slifer
     */
    quit(): void {
        Slifer.running = false;
    }
}

export default Slifer;