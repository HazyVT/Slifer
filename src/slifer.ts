import { base } from "./external";

class Slifer 
{
  public static initWindow(title: string, width: number, height: number) {
    // Initialize SDL libraries
    const initValue = base.symbols.SDL_Init(48);
    if (initValue != 0)
    {
      throw new Error("Slifer: Initialize failed");
    }


  }
}

export default Slifer;
