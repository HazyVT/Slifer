import Slifer from "./src/slifer";
import Image from "./src/engine/image";
import Vector2 from "./src/engine/vector2";
import Color from "./src/engine/color";
import Audio from "./src/engine/audio";
import Rectangle from "./src/engine/rectangle";
import Font from "./src/engine/font";
import Cursor from './src/engine/cursor';

import { type keys } from './src/modules/keyboard';

const slf = new Slifer();
export { Vector2, Color, Image, Audio, Rectangle, Font, Cursor, slf as Slifer, type keys };
