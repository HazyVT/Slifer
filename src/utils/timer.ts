import { libs } from "../ffi.ts"

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

   		this.mStartTicks = Number(libs.SDL.SDL_GetTicks64());
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

			this.mPausedTicks = Number(libs.SDL.SDL_GetTicks64()) - this.mStartTicks;
			this.mStartTicks = 0;
		}
   	}

   	public unpause() {
		if (this.mStarted && this.mPaused) {
			this.mPaused = false;

			this.mStartTicks = Number(libs.SDL.SDL_GetTicks64()) - this.mPausedTicks;
			this.mPausedTicks = 0;
		}
   	}

   	public getTicks() {
   		let time = 0;

   		if (this.mStarted) {
   			if (this.mPaused) {
   				time = this.mPausedTicks;
   			} else {
   				time = Number(libs.SDL.SDL_GetTicks64()) - this.mStartTicks;
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
