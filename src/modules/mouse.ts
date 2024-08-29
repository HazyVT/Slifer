class Mouse {

    private holdButtonMap = new Map<string, boolean>();
    private pressedButtonMap = new Map<string, boolean>();
    private releasedButtonMap = new Map<string, boolean>();

    private setButtonDown(button: number) {
        switch (button) {
            case 1:
                this.holdButtonMap.set('left', true);
                this.releasedButtonMap.set('left', false);
                break;
            case 2:
                this.holdButtonMap.set('middle', true);
                this.releasedButtonMap.set('middle', false);
                break;
            case 3:
                this.holdButtonMap.set('right', true);
                this.releasedButtonMap.set('right', false);
                break;
        }
    }

    private setButtonUp(button: number) {
        switch (button) {
            case 1:
                this.holdButtonMap.set('left', false);
                this.pressedButtonMap.set('left', false);
                break;
            case 2:
                this.holdButtonMap.set('middle', false);
                this.pressedButtonMap.set('middle', false);
                break;
            case 3:
                this.holdButtonMap.set('right', false);
                this.pressedButtonMap.set('right', false);
                break;
        }
    }

    isDown(button: buttons) : boolean {
        const vbutton = this.holdButtonMap.get(button);
        if (vbutton == undefined) return false;

        return vbutton;
    }

    isPressed(button: buttons) : boolean {
        const pbutton = this.pressedButtonMap.get(button)
        const hbutton = this.holdButtonMap.get(button);

        if (hbutton == true) {
            if (pbutton == false || pbutton == undefined) {
                this.pressedButtonMap.set(button, true);
                return true;
            }
        }

        return false;
    }

    isReleased(button: buttons) : boolean {
        const rbutton = this.releasedButtonMap.get(button)
        const hbutton = this.holdButtonMap.get(button);

        if (!hbutton) {
            if (rbutton == false) {
                this.releasedButtonMap.set(button, true);
                return true;
            }
        }

        return false;

    }
    
}

export type buttons = 'left' | 'middle' | 'right';

export default Mouse;