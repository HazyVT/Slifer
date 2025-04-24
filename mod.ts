import Slifer from './src/slifer.ts';
import { keys } from "./src/modules/keyboard.ts";
import { Color, Image } from "./src/engine.ts";

const slf = new Slifer();

export { Color, Image, slf as Slifer, type keys };
