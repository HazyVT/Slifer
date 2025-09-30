import { sdl } from "./ffi.ts";
import { Color } from "./utils.ts";
import Window from "./window.ts";

class Slifer {

    public Window = Window;

    static window: Deno.PointerValue;
    static renderer: Deno.PointerValue;
    static shouldLog: boolean = true
    static running: boolean = true;

    static backgroundColor: Color = new Color(255,0,0,255);

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
        if (sdl.SDL_PollEvent(event) == 1) {
            const view = new Deno.UnsafePointerView(event!);
            const type = view.getUint16();

            if (type == 256) Slifer.running = false;
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

    render(): void {
        sdl.SDL_RenderPresent(Slifer.renderer);
    }

    


}

export default Slifer;