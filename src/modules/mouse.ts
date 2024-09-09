class Mouse {

    static downKeyMap = new Map<string, boolean>();
    static pressedKeyMap = new Map<string, boolean>();
    static releasedKeyMap = new Map<string, boolean>();
    
    static setButtonDown(button: number) {

        let key : string = '';
        if (button == 1) {
            key = "left";
        } else if (button == 2) {
            key = "middle";
        } else {
            key = "right";
        }

        this.downKeyMap.set(key, true);
        this.releasedKeyMap.set(key, false);
    }

    static setButtonUp(button: number) {

        let key : string = '';
        if (button == 1) {
            key = "left";
        } else if (button == 2) {
            key = "middle";
        } else {
            key = "right";
        }
        
        this.downKeyMap.set(key, false);
        this.pressedKeyMap.set(key, false);
    }

    /**
     * 
     * @param key string of key
     * @returns if the key is being held down
     */
    isDown(key: buttons) {
        const _state = Mouse.downKeyMap.get(key);
        if (_state == undefined) return false

        return _state;
    }

    /**
     * 
     * @param key string of key
     * @returns if key is pressed. Returns only once
     */
    isPressed(key: buttons) {
        const _pressedState = Mouse.pressedKeyMap.get(key);
        const _downState = Mouse.downKeyMap.get(key);

        if (_downState == true) {
            if (_pressedState == false || _pressedState == undefined) {
                Mouse.pressedKeyMap.set(key, true);
                return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param key string of key
     * @returns if key is released. Returns only once
     */
    isReleased(key: buttons) {
        const _releasedState = Mouse.releasedKeyMap.get(key);
        const _downState = Mouse.downKeyMap.get(key);

        if (_downState == false) {
            if (_releasedState == false || undefined) {
                Mouse.releasedKeyMap.set(key, true);
                return true;
            }
        }

        return false;
    }
}

type buttons = 'left' | 'middle' | 'right';

export default Mouse;