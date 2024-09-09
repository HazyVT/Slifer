import { type Pointer } from 'bun:ffi';

class Global {

    static ptrWindow : Pointer;
    static ptrRenderer : Pointer;
}

export default Global;