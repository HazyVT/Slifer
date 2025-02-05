# Slifer : Native Typescript Game Framework

<p align="center">
    <img width="80%" src="https://ucarecdn.com/288f053f-61e0-42e6-804a-8c1d48a41aac/-/preview/1000x562/">
</p>

> [!CAUTION]
> Slifer is currently in alpha. Use at your own risk.

> [!NOTE]
> Not all basic features have been implemented. Many are missing such as
> window customization. As such, I recommend waiting for a beta release of
> Slifer before using it for a long term project.

For up to date docs, please head over to the [Slifer Webpage](https://slifer.hazyvt.com).

## Introduction

Slifer is a game framework made to allow users to code games in typescript. The
framework uses bun and SDL2 under the hood to allow your game to render and
build natively to desktop.

## Contents

- [Goals](#goals)
- [Current Features](#current-features)
- [Future Features](#future-features)
- [Example](#example)

## Goals

- Contain all basic game framework implementations. Such as drawing images,
  drawing text and making animations from a sprite sheet.
- Provide an easy transition from web development to game development.
- Create an easy to use framework. Slifer should handle the bulk of the work
- Keep updates consistent.

## Current Features

- Create a native desktop window with custom title and size.
- Handle both keyboard and mouse inputs
- Load and draw images onto the window
- Play Audio

## Future Features

- Animation library
- Save file library

## Example

```ts
import Slifer, { Vector2 } from "slifer";

Slifer.createWindow("Example Window", new Vector2(640, 480));

const bg = Slifer.Graphics.makeColor(36, 36, 36, 255);

while (!Slifer.shouldClose()) {
    Slifer.Graphics.setBackground(bg);

    if (Slifer.Keyboard.isPressed("escape")) {
        Slifer.isRunning = false;
    }

    Slifer.Graphics.render();
}

Slifer.quit();
```
