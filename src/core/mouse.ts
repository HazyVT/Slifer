class Mouse {

	private static downButtonMap = new Map<number, boolean>();
	private static pressedButtonMap = new Map<number, boolean>();

	private static setButtonDown(button: number) : void
	{
		this.downButtonMap.set(button, true);
	}

	private static setButtonUp(button: number) : void
	{
		this.downButtonMap.set(button, false);
		this.pressedButtonMap.set(button, false);
	}

	public static isDown(button: number) : boolean
	{
		const value = this.downButtonMap.get(button);
		if (value == undefined)
		{
			return false;
		} else
		{
			return value;
		}
	}

	public static isPressed(button: number) : boolean
	{
		const pValue = this.pressedButtonMap.get(button);
		const dValue = this.downButtonMap.get(button);

		if (dValue == true)
		{
			if (pValue == false || pValue == undefined)
			{
				this.pressedButtonMap.set(button, true);
				return true;
			}
		}

		return false;
	}

	
}

export default Mouse
