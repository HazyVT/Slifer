import { libsdl } from "../ffi";

export class Timer {

	private mStartTicks;
	private mPausedTicks;
	private mPaused;
	private mStarted;
	
    
    constructor() {
    	this.mStartTicks = 0;
    	this.mPausedTicks = 0;
    	this.mPaused = false;
    	this.mStarted = false;
    }
    
   	public start() {
   		this.mStarted = true;

   		this.mPaused = false;

   		this.mStartTicks = libsdl.symbols.SDL_GetTicks();
		this.mPausedTicks = 0;
   	}

   	public stop() {
   		this.mStarted = false;
   		this.mPaused = true;

   		this.mStartTicks = 0;
   		this.mPausedTicks = 0;
   	}

   	public pause() {
		if (this.mStarted && !this.mPaused) {
			this.mPaused = true;

			this.mPausedTicks = libsdl.symbols.SDL_GetTicks() - this.mStartTicks;
			this.mStartTicks = 0;
		}
   	}

   	public unpause() {
		if (this.mStarted && this.mPaused) {
			this.mPaused = false;

			this.mStartTicks = libsdl.symbols.SDL_GetTicks() - this.mPausedTicks;
			this.mPausedTicks = 0;
		}
   	}

   	public getTicks() {
   		let time = 0;

   		if (this.mStarted) {
   			if (this.mPaused) {
   				time = this.mPausedTicks;
   			} else {
   				time = libsdl.symbols.SDL_GetTicks() - this.mStartTicks;
   			}
   		}

   		return time;
   	}

   	public isStarted() {
   		return this.mStarted;
   	}

   	public isPaused() {
   		return (this.mPaused && this.mStarted);
   	}

   	

    
}

