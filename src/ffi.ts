const baseName = {
	windows: "SDL2.dll",
	darwin: "libSDL2.dylib",
	linux: "libSDL2.so",
	android: "",
	freebsd: "",
	netbsd: "",
	aix: "",
	solaris: "",
	illumos: ""
}[Deno.build.os]

const imageName = {
	windows: "SDL2_image.dll",
	darwin: "libSDL2_image.dylib",
	linux: "libSDL2_image.so",
	android: "",
	freebsd: "",
	netbsd: "",
	aix: "",
	solaris: "",
	illumos: ""
}[Deno.build.os]

const base = Deno.dlopen(baseName, {
	SDL_Init: {
		parameters: ["i32"],
		result: "i32"
	},
	SDL_CreateWindow: {
		parameters: ["buffer", "i32", "i32", "i32", "i32", "i32"],
		result: "pointer"
	},
	SDL_PollEvent: {
		parameters: ["pointer"],
		result: "i32"
	},
	SDL_CreateRenderer: {
		parameters: ["pointer", "i32", "i32"],
		result: "pointer"
	},
	SDL_GetKeyboardState: {
		parameters: ["pointer"],
		result: "pointer"
	},
	SDL_GetKeyFromScancode: {
		parameters: ["i32"],
		result: "i32"
	},
	SDL_GetKeyName: {
		parameters: ['i32'],
		result: 'pointer'
	},
	SDL_GetMouseState: {
		parameters: ["pointer", "pointer"],
		result: 'u16'
	},
	SDL_RenderClear: {
		parameters: ['pointer'],
		result: 'i32'
	},
	SDL_RenderPresent: {
		parameters: ['pointer'],
		result: 'i32'
	},
	SDL_SetRenderDrawColor: {
		parameters: ['pointer', 'i8', 'i8', 'i8', 'i8'],
		result: 'i32'
	},
	SDL_QueryTexture: {
		parameters: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
		result: 'i32'
	},
	SDL_RenderCopy: {
		parameters: ['pointer', 'pointer', 'pointer', 'pointer'],
		result: 'i32'
	},
	SDL_SetHint: { 
		parameters: ['buffer', 'buffer'],
		result: 'bool'
	},
	SDL_DestroyRenderer: {
		parameters: ['pointer'],
		result: 'void'
	},
	SDL_DestroyWindow: {
		parameters: ['pointer'],
		result: 'void'
	},
	SDL_DestroyTexture: {
		parameters: ['pointer'],
		result: 'void'
	},
	SDL_RenderFillRect: {
		parameters: ['pointer', 'pointer'],
		result: 'i32'
	},
	SDL_RenderDrawRect: {
		parameters: ['pointer', 'pointer'],
		result: 'i32'
	}
})

const img = Deno.dlopen(imageName, {
	IMG_Init: {
		parameters: ['i32'],
		result: 'i32'
	},
	IMG_LoadTexture: {
		parameters: ['pointer', 'buffer'],
		result: 'pointer'
	}

})


export const closeBase = () => base.close();
export const closeImage = () => img.close();

export const sdl = base.symbols;
export const image = img.symbols;
