import { dlopen } from 'bun:ffi';

//@ts-ignore
import libsdlImport from '../libs/libSDL2.dylib';

const libsdl = libsdlImport;

export const base = dlopen(libsdl, {
  SDL_Init: { 
    args: ['int'],
    returns: 'int'
  },
  SDL_CreateWindow: {
  	args: ['cstring', 'int', 'int', 'int', 'int', 'uint32_t'],
  	returns: 'pointer'
  },
  SDL_PollEvent: {
  	args: ['pointer'],
  	returns: 'int'
  },
  SDL_Quit: {
  	returns: 'void'
  }
})
