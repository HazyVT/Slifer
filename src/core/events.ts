import Slifer from '../slifer';
import Keyboard from './keyboard';

class Events {

	private static handleEvents(array: Uint16Array) : void
	{
		switch (array[0])
		{
			case 256:
				// Quit Event
				Slifer.isRunning = false;
				break;
			case 771:
				// Keydown event
				(Keyboard as any).setKeyDown(array[6]);
				break;
			case 769:
				// Keyup event;
				(Keyboard as any).setKeyUp(array[10]);
				break;
			default:
				//console.log(array);
				break;
		}
	}
}

export default Events;
