import Window from "./window.ts";

class Slifer {

    public Window = Window;

    static window: Deno.PointerValue;
    static renderer: Deno.PointerValue;
    static shouldLog: boolean = true

    static log(text: string) {
        if (this.shouldLog) {
            console.log(`Slifer: ${text}`)
        }
    }

    /**
     * 
     * @param flag - Should slifer log default logs. False will turn default logs off
     */
    setLog(flag: boolean) {
        Slifer.shouldLog = flag
    }

    


}

export default Slifer;