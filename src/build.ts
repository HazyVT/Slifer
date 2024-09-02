import fs from "fs";
import { $ } from "bun";

// Plist content
const plist = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>CFBundleDisplayName</key>
        <string>Slifer</string>
        <key>CFBundleExecutable</key>
        <string>main</string>
        <key>CFBundleIconFile</key>
        <string>icons/draggie.icns</string>
        <key>CFBundleIdentifier</key>
        <string>Slifer</string>
        <key>CFBundleInfoDictionaryVersion</key>
        <string>6.0</string>
        <key>CFBundleName</key>
        <string>Slifer</string>
        <key>CFBundlePackageType</key>
        <string>APPL</string>
        <key>CFBundleShortVersionString</key>
        <string>0.0.0</string>
        <key>NSHighResolutionCapable</key>
        <true/>
    </dict>
    </plist>`;

// Makes mac arm
await $`bun make-mac-arm`;
await $`mkdir Build`;
await $`mkdir Build/Contents`;
await $`mkdir Build/Contents/Macos`;
await $`mv main Build/Contents/Macos`;
await $`cp -r src/Resources Build/Contents/Resources`;
//await $`cp src/sample.plist Build/Contents/info.plist`
fs.writeFileSync("Build/Contents/info.plist", plist);
await $`mv Build Slifer-arm-${process.env.VERSION}.app`;
console.log("MAC ARM BUILD COMPLETE");

// Makes mac x64
await $`bun make-mac-x64`;
await $`mkdir Build`;
await $`mkdir Build/Contents`;
await $`mkdir Build/Contents/Macos`;
await $`mv main Build/Contents/Macos`;
await $`cp -r src/Resources Build/Contents/Resources`;
//await $`cp src/sample.plist Build/Contents/info.plist`
fs.writeFileSync("Build/Contents/info.plist", plist);
await $`mv Build Slifer-x64-${process.env.VERSION}.app`;
console.log("MAC X64 BUILD COMPLETE");

// Makes windows x64
await $`bun make-windows-x64`;
await $`mkdir Build`;
await $`mkdir Build/bin`;
await $`mv main.exe Build/bin`;
await $`cp -r src/Resources Build/Resources`;
await $`zip -r Slifer-Win64-${process.env.VERSION}.zip Build`;
await $`rm -r Build`;
console.log("WINDOWS X64 BUILD COMPLETE");

await $`mkdir Builds`;
await $`mv Slifer-arm-${process.env.VERSION}.app Builds`;
await $`mv Slifer-x64-${process.env.VERSION}.app Builds`;
await $`mv Slifer-Win64-${process.env.VERSION}.zip Builds`;