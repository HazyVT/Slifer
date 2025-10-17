# Slifer : Native Typescript Game Framework

![Alt Slifer](https://uj50iigbnt.ufs.sh/f/51Ynzohi43C5UxTGbXQXNVZ7sOBqydrufmtCMz2anxJ6FjL5 "Slifer")
> [!CAUTION]
> Slifer is currently in alpha. Use at your own risk.

> [!NOTE]
> Not all basic features have been implemented. Many are missing such as
> window customization. As such, I recommend waiting for a beta release of
> Slifer before using it for a long term project.

## Table of contents
- [Introduction](#introduction)
- [Installation](#installation)
	- [Linux](#linux)
	- [Windows](#windows)
	- [MacOS](#macos)
- [Goals](#goals)
- [Example](#example)

## Introduction

Slifer is a 2D game framework made to allow users to code games in typescript. The
framework uses deno and SDL2 under the hood to allow your game to render and
build natively to desktop.

## Installation

### Linux

#### Debian
```shell
sudo apt upgrade
sudo apt install libsdl2-dev
sudo apt install libsdl2-image-dev
```

#### Other flavours

On linux, Slifer will look for all dynamic library files inside of <code>/usr/lib/x86_64-linux-gnu/</code> as that is the default install location on debian. If you are on any other flavour of linux, please move the files <code>libSDL2.so</code> **and** <code>libSDL2_image.so</code> to this directory.

### Windows

Click on both of these links and download the latest release that begins with the tag 2.x. Most if not all windows users will be on 64bit architecture so download the zip file with win32-x64 in the file name.

- [SDL Github Release Page](https://github.com/libsdl-org/SDL/releases)
- [SDL Image Github Release Page](https://github.com/libsdl-org/SDL_image/releases)

Once both zip files have been downloaded move both <code>SDL2.dll</code> **and** <code>SDL2_image.dll</code> to <code>C:\\Windows\\System32</code>.

### MacOS

If you don't already, please download and install homebrew.

- [Homebrew](https://brew.sh/)

Once homebrew is installed. Just run this command

```shell
brew install sdl2
brew install sdl2_image
```

By default, Slifer will look inside <code>/opt/homebrew/lib</code> for all the dynamic library files. 

## Goals

- Contain all basic game framework implementations. Such as drawing images,
  drawing text and making animations from a sprite sheet.
- Create an easy to use framework. Slifer should handle the bulk of the work.
- Keep updates consistent.

## Example
```ts
import { Slifer, type Color } from "@hazora/slifer";

const window = new Slifer.Window("Hello", 640, 360);

const background: Color = new Slifer.Color(48, 52, 70);

Slifer.setBackground(background);

while (Slifer.isRunning()) {

    if (Slifer.Keyboard.isKeyPressed('escape')) {
        Slifer.quit();
    }

    Slifer.render();
}
```