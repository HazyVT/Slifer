import { type Pointer } from 'bun:ffi';

class Global {

    static ptrWindow : Pointer;
    static ptrRenderer : Pointer;
    static ptrFont : Pointer;
}

/** @internal */
export default Global;