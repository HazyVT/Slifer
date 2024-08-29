import { libsdl } from "../ffi";

class Keyboard {
  private holdKeyMap = new Map<string, boolean>();
  private pressedKeyMap = new Map<string, boolean>();
  private releasedKeyMap = new Map<string, boolean>();

  
  private setKeyDown(scancode: number) {
    const keycode = libsdl.symbols.SDL_GetKeyFromScancode(scancode);
    const keyString = libsdl.symbols.SDL_GetKeyName(keycode);
    const finalKeyString = keyString.toLocaleLowerCase().toString();
    
    this.holdKeyMap.set(finalKeyString, true);   
    this.releasedKeyMap.set(finalKeyString, false); 
  }

  private setKeyUp(scancode: number) {
    const keycode = libsdl.symbols.SDL_GetKeyFromScancode(scancode);
    const keyString = libsdl.symbols.SDL_GetKeyName(keycode);
    const finalKeyString = keyString.toLocaleLowerCase().toString();
    
    this.holdKeyMap.set(finalKeyString, false);
    this.pressedKeyMap.set(finalKeyString, false);
  }

  isDown(key: keys) : boolean {
    const vkey = this.holdKeyMap.get(key);

    if (vkey == undefined) return false;
    return vkey;
  }

  isPressed(key: keys) : boolean {
    const pkey = this.pressedKeyMap.get(key);
    const hkey = this.holdKeyMap.get(key);

    if (hkey == true) {
        if (pkey == false || pkey == undefined) {
            this.pressedKeyMap.set(key, true);
            return true;
        }
    }

    return false;
  }

  isReleased(key: keys) : boolean {
    const rkey = this.releasedKeyMap.get(key);
    const hkey = this.holdKeyMap.get(key);

    if (hkey == false) {
        if (rkey == false) {
            this.releasedKeyMap.set(key, true);
            return true;
        }
    }

    return false;
  }
}

type keys = "unknown" |
"return" |
"escape" |
"backspace" |
"tab" |
"space" |
"#" |
"%" |
"$" |
"&" |
"'" |
"(" |
")" |
"*" |
"+" |
'"' |
"-" |
"." |
"/" |
"0" |
"1" |
"2" |
"3" |
"4" |
"5" |
"6" |
"7" |
"8" |
"9" |
":" |
";" |
"<" |
"=" |
">" |
"?" |
"@" |
"[" |
"]" |
"^" |
"_" |
"`" |
"a" |
"b" |
"c" |
"d" |
"e" |
"f" |
"g" |
"h" |
"i" |
"j" |
"k" |
"l" |
"m" |
"n" |
"o" |
"p" |
"q" |
"r" |
"s" |
"t" |
"u" |
"v" |
"w" |
"x" |
"y" |
"z" |
"capslock" |
"f1" |
"f2" |
"f3" |
"f4" |
"f5" |
"f6" |
"f7" |
"f8" |
"f9" |
"f10" |
"f11" |
"f12" |
"printscreen" |
"scrolllock" |
"pause" |
"insert" |
"home" |
"pageup" |
"delete" |
"end" |
"pagedown" |
"right" |
"down" |
"up" |
"left"



export default Keyboard;
