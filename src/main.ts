import { sdl } from "./ffi.ts";
import { Color, type Keys } from "./utils.ts";
import Window from "./window.ts";

class Slifer {

    public Window = Window;

    // Event codes
    private QUIT = 256;
    private KEYDOWN = 768;
    private KEYUP = 769;
    

    static window: Deno.PointerValue;
    static renderer: Deno.PointerValue;
    static shouldLog: boolean = true
    static running: boolean = true;


    private static keyMap: Map<string, -1 | 0 | 1 | 2> = new Map();
    private static backgroundColor: Color = new Color(255,0,0,255);

    static log(text: string) {
        if (this.shouldLog) {
            console.log(`Slifer: %c${text}`, "color: green;");
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
     * @returns running - whether Slifer is running or not
     */
    isRunning(): boolean {
        // Draw background color
        sdl.SDL_SetRenderDrawColor(
            Slifer.renderer,
            Slifer.backgroundColor.red,
            Slifer.backgroundColor.green,
            Slifer.backgroundColor.blue,
            Slifer.backgroundColor.alpha
        );

        // Clear renderer for drawing
        sdl.SDL_RenderClear(Slifer.renderer);

        // Handle window events
        const eventArr = new Uint16Array(32);
        const event = Deno.UnsafePointer.of(eventArr);
        while (sdl.SDL_PollEvent(event)) {
            const view = new Deno.UnsafePointerView(event!);
            const type = view.getUint16();

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
     * @param key - string of which key to get
     * @returns if that key has been released in the last frame
     */
    isKeyReleased(key: Keys) : boolean {
        const state = Slifer.keyMap.get(key);
        if (state == -1) return true;

        return false;
    }

    

    


}

export default Slifer;