import Slifer from './src/slifer.ts';
import type { keys } from "./src/modules/keyboard.ts";
import { Color, Image, Cursor } from "./src/engine.ts";

const slf : Slifer = new Slifer();

export { Color, Image, Cursor, slf as Slifer, type keys };
