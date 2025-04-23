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
	}
})

export const closebase = () => base.close();

export const sdl = base.symbols;
