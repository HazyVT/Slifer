import { closeAllLibraries, libs } from "./ffi.ts";
import Color from "./utils/color.ts";
import Window from "./window.ts";
import Keyboard from "./utils/keyboard.ts";
import Mouse from "./utils/mouse.ts";
import Image from "./utils/image.ts";
import Font from "./utils/font.ts";

class Slifer {

    
    static window: Deno.PointerValue;
    static renderer: Deno.PointerValue;

    static loadedTextures: Deno.PointerValue[] = []
    static loadedFonts: Deno.PointerValue[] = [];

    public Window = Window;
    public Keyboard = new Keyboard();
    public Mouse = new Mouse();
    public Image = Image;
    public Color = Color;
    public Font = Font;

    private isRunning = true;
    private backgroundColor: Color = new Color(0,0,0);
    
    /**
     * 
     * @returns where slifer should close
     */
    public shouldClose() : boolean {
        // Set the background color
        libs.SDL.SDL_SetRenderDrawColor(
            Slifer.renderer,
            this.backgroundColor.red,
            this.backgroundColor.green,
            this.backgroundColor.blue,
            255
        )

        // Clear the renderer
        libs.SDL.SDL_RenderClear(Slifer.renderer);

        // Handle quit event
        const eventArray = new Uint16Array(32);
        const eventPointer = Deno.UnsafePointer.of(eventArray);
        if (libs.SDL.SDL_PollEvent(eventPointer)) {
            const view = new Deno.UnsafePointerView(eventPointer!);
            const type = view.getUint16();

            // Event 256 - QUIT
            if (type == 256) {
                this.quit();
            }
        }

        // Handle keyboard state
        Keyboard.handleKeyboard();

        // Handle mouse state
        Mouse.handleMouse();
        
        return !this.isRunning;
    }

    /**
     * 
     * @param color - Color object created using Slifer.Color()
     */
    public setBackgroundColor(color: Color): void {
        this.backgroundColor = color;
    }
    

    /**
     * Renders all draw functions to the
     */
    public render() : void {
        libs.SDL.SDL_RenderPresent(Slifer.renderer);
    }
    
    /**
     * Quits slifer safely. Should always be used if you want to stop running slifer.
     */
    public quit() : void {
        // Destroy all fonts
        for (const font of Slifer.loadedFonts) {
            libs.TTF.TTF_CloseFont(font);
        }
        
        // Destroy all textures
        for (const texture of Slifer.loadedTextures) {
            libs.SDL.SDL_DestroyTexture(texture);
        }
        
        // Destory window and renderer
        libs.SDL.SDL_DestroyRenderer(Slifer.renderer);
        libs.SDL.SDL_DestroyWindow(Slifer.window);

        // Close libraries
        closeAllLibraries();
        

        this.isRunning = false;
    }

}

export default Slifer;