import Slifer from './src/slifer.ts';
import { keys } from "./src/modules/keyboard.ts";
import { Color, Image, Cursor } from "./src/engine.ts";

const slf = new Slifer();

export { Color, Image, Cursor, slf as Slifer, type keys };
