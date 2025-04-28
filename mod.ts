import Slifer from './src/slifer.ts';
import type { keys } from "./src/modules/keyboard.ts";
import { Color, Image, Cursor, Vector2, Rectangle } from "./src/engine.ts";

const slf : Slifer = new Slifer();

export { Color, Image, Cursor, Rectangle, Vector2, slf as Slifer, type keys };
