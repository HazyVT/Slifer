class Keyboard {

	private static downKeyMap = new Map<number, boolean>();
	private static pressedKeyMap = new Map<number, boolean>();

	private static setKeyDown(key: number)
	{
		this.downKeyMap.set(key, true);
	}

	private static setKeyUp(key: number)
	{
		this.downKeyMap.set(key, false);
		this.pressedKeyMap.set(key, false);
	}

	public static isDown(key: number) : boolean
	{
		const value = this.downKeyMap.get(key);
		if (value == undefined)
		{
			return false;
		} else
		{
			return value;
		}
	}

	public static isPressed(key: number) : boolean
	{
		const pValue = this.pressedKeyMap.get(key);
		const dValue = this.downKeyMap.get(key);

		// Check if key has been pressed down
		if (dValue == true)
		{
			// Check if pressed value of key is false
			// If so set it to true then return true
			// In any other instance return false
			if (pValue == false || pValue == undefined)
			{
				this.pressedKeyMap.set(key, true);
				return true;
			}
		}

		return false;
	}
}

export default Keyboard;
