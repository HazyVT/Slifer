import { libs } from "../ffi.ts";

class Mouse {

    /**
     * -1 is equal to just released.
     * 0 is equal to being up.
     * 1 is equal to just pressed.
     * 2 is equal to being down.
     */
    private static buttonMap: Map<string, -1 | 0 | 1 | 2> = new Map();
    private static buttons: string[] = ["left", "middle", "right"];

    private static setMouseButtonDownInMap(name: string) {
        const mbState = this.buttonMap.get(name);
        if (mbState == undefined || mbState == 0) {
            this.buttonMap.set(name, 1);
        } else if (mbState == 1) {
            this.buttonMap.set(name, 2);
        }
    }

    private static setMouseButtonUpInMap(name: string) {
        const mbState = this.buttonMap.get(name);
        if (mbState == undefined || mbState == -1) {
            this.buttonMap.set(name, 0);
        } else if (mbState > 0) {
            this.buttonMap.set(name, -1);
        }
    }

    public static handleMouse() : void {
        const mouseState = libs.SDL.SDL_GetMouseState(null, null);

        const mouseButtonDownStates = [];
        if (mouseState & 1) mouseButtonDownStates.push('left');
        if (mouseState & 2) mouseButtonDownStates.push('middle');
        if (mouseState & 4) mouseButtonDownStates.push('right'); 


        for (const name of this.buttons) {
            if (mouseButtonDownStates.includes(name)) {
                this.setMouseButtonDownInMap(name);
            } else {
                this.setMouseButtonUpInMap(name);
            }
        }

             
    }

    /**
     * 
     * @param button - string of which mouse button to check
     * @returns if that mouse button is being held down
     */
    public isMouseButtonDown(button: Buttons) : boolean {
        const buttonStateInMap = Mouse.buttonMap.get(button);
        if (buttonStateInMap == 1 || buttonStateInMap == 2) return true;

        return false;
    }

    /**
     * 
     * @param button - string of which mouse button to check
     * @returns if that mouse button was pressed in the last frame
     */
    public isMouseButtonPressed(button: Buttons) : boolean {
        const buttonStateInMap = Mouse.buttonMap.get(button);
        if (buttonStateInMap == 1) return true;

        return false;
    }

    /**
     * 
     * @param button - string of which mouse button to check
     * @returns if that mouse button was released in the last frame
     */
    public isMouseButtonReleased(button: Buttons) : boolean {
        const buttonStateInMap = Mouse.buttonMap.get(button);
        if (buttonStateInMap == -1) return true;

        return false;
    }

}

export default Mouse;

type Buttons = 
    | 'left'
    | 'middle'
    | 'right'