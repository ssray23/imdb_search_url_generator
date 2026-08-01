#!/bin/bash
set -e

APP_NAME="IMDb Search URL Generator.app"
BUILD_DIR="./build_app"
ICON_SRC="clean_icon.png"

echo "Building Swift launcher executable..."
swiftc launcher.swift -o "IMDb Search Generator"

echo "Copying browser favicon..."
mkdir -p public
cp "$ICON_SRC" public/favicon.png

echo "Generating macOS AppIcon.icns..."
rm -rf AppIcon.iconset AppIcon.icns
mkdir -p AppIcon.iconset

sips -s format png -z 16 16     "$ICON_SRC" --out AppIcon.iconset/icon_16x16.png > /dev/null 2>&1
sips -s format png -z 32 32     "$ICON_SRC" --out AppIcon.iconset/icon_16x16@2x.png > /dev/null 2>&1
sips -s format png -z 32 32     "$ICON_SRC" --out AppIcon.iconset/icon_32x32.png > /dev/null 2>&1
sips -s format png -z 64 64     "$ICON_SRC" --out AppIcon.iconset/icon_32x32@2x.png > /dev/null 2>&1
sips -s format png -z 128 128   "$ICON_SRC" --out AppIcon.iconset/icon_128x128.png > /dev/null 2>&1
sips -s format png -z 256 256   "$ICON_SRC" --out AppIcon.iconset/icon_128x128@2x.png > /dev/null 2>&1
sips -s format png -z 256 256   "$ICON_SRC" --out AppIcon.iconset/icon_256x256.png > /dev/null 2>&1
sips -s format png -z 512 512   "$ICON_SRC" --out AppIcon.iconset/icon_256x256@2x.png > /dev/null 2>&1
sips -s format png -z 512 512   "$ICON_SRC" --out AppIcon.iconset/icon_512x512.png > /dev/null 2>&1
sips -s format png -z 1024 1024 "$ICON_SRC" --out AppIcon.iconset/icon_512x512@2x.png > /dev/null 2>&1

iconutil -c icns AppIcon.iconset -o AppIcon.icns
rm -rf AppIcon.iconset

echo "Creating App Bundle structure..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/$APP_NAME/Contents/MacOS"
mkdir -p "$BUILD_DIR/$APP_NAME/Contents/Resources"

cp "IMDb Search Generator" "$BUILD_DIR/$APP_NAME/Contents/MacOS/"
cp AppIcon.icns "$BUILD_DIR/$APP_NAME/Contents/Resources/"

cat << 'EOF' > "$BUILD_DIR/$APP_NAME/Contents/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>IMDb Search Generator</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleIdentifier</key>
    <string>com.antigravity.imdb-search-generator</string>
    <key>CFBundleName</key>
    <string>IMDb Search URL Generator</string>
    <key>CFBundleDisplayName</key>
    <string>IMDb Search URL Generator</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>11.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

chmod +x "$BUILD_DIR/$APP_NAME/Contents/MacOS/IMDb Search Generator"

echo "Installing to Applications folder..."
mkdir -p "$HOME/Applications"
rm -rf "$HOME/Applications/$APP_NAME"
cp -R "$BUILD_DIR/$APP_NAME" "$HOME/Applications/"

# Force Finder icon cache refresh
touch "$HOME/Applications/$APP_NAME"

echo "Successfully installed $APP_NAME with clean transparent IMDb icon to $HOME/Applications!"
