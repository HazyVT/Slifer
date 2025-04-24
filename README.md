# Slifer : Native Typescript Game Framework

![Alt Slifer](https://uj50iigbnt.ufs.sh/f/51Ynzohi43C5UxTGbXQXNVZ7sOBqydrufmtCMz2anxJ6FjL5 "Slifer")
> [!CAUTION]
> Slifer is currently in alpha. Use at your own risk.

> [!NOTE]
> Not all basic features have been implemented. Many are missing such as
> window customization. As such, I recommend waiting for a beta release of
> Slifer before using it for a long term project.

## Introduction

Slifer is a 2D game framework made to allow users to code games in typescript. The
framework uses deno and SDL2 under the hood to allow your game to render and
build natively to desktop.

## Goals

- Contain all basic game framework implementations. Such as drawing images,
  drawing text and making animations from a sprite sheet.
- Provide an easy transition from web development to game development.
- Create an easy to use framework. Slifer should handle the bulk of the work.
- Keep updates consistent.

## Example
```ts
import { Slifer, Color } from 'slifer';

const window = Slifer.createWindow('Hello From Slifer!', 640, 480);

const bgColor = new Color(48, 52, 70, 255);

while (!Slifer.shouldClose()) {
	Slifer.Graphics.setBackground(bgColor);

	if (Slifer.Keyboard.isPressed('space')) {
		console.log('Beep :3');
	}

	Slifer.Graphics.render();
}

Slifer.quit();
```