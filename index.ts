import { SliferClass } from "./src/slifer";

export type { ImageType as Image } from "./src/modules/graphics";
export { Vector2 } from "./src/engine/vector";
export { Rectangle } from "./src/engine/rectangle";
export { Timer } from "./src/engine/time";
export { AudioSource } from "./src/modules/audio";

const Slifer = new SliferClass();
export default Slifer;
