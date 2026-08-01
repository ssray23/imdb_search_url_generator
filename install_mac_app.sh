#!/bin/bash
set -e

APP_NAME="IMDb Search URL Generator.app"
TEMP_BUILD_DIR="/tmp/imdb_app_build"
ICON_SRC="public/favicon.png"

echo "Setting up temporary build directory at $TEMP_BUILD_DIR..."
rm -rf "$TEMP_BUILD_DIR"
mkdir -p "$TEMP_BUILD_DIR"

echo "Building Swift launcher executable..."
swiftc launcher.swift -o "$TEMP_BUILD_DIR/IMDb Search Generator"

echo "Generating macOS AppIcon.icns in temporary directory..."
mkdir -p "$TEMP_BUILD_DIR/AppIcon.iconset"

sips -s format png -z 16 16     "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_16x16.png" > /dev/null 2>&1
sips -s format png -z 32 32     "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_16x16@2x.png" > /dev/null 2>&1
sips -s format png -z 32 32     "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_32x32.png" > /dev/null 2>&1
sips -s format png -z 64 64     "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_32x32@2x.png" > /dev/null 2>&1
sips -s format png -z 128 128   "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_128x128.png" > /dev/null 2>&1
sips -s format png -z 256 256   "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_128x128@2x.png" > /dev/null 2>&1
sips -s format png -z 256 256   "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_256x256.png" > /dev/null 2>&1
sips -s format png -z 512 512   "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_256x256@2x.png" > /dev/null 2>&1
sips -s format png -z 512 512   "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_512x512.png" > /dev/null 2>&1
sips -s format png -z 1024 1024 "$ICON_SRC" --out "$TEMP_BUILD_DIR/AppIcon.iconset/icon_512x512@2x.png" > /dev/null 2>&1

iconutil -c icns "$TEMP_BUILD_DIR/AppIcon.iconset" -o "$TEMP_BUILD_DIR/AppIcon.icns"
rm -rf "$TEMP_BUILD_DIR/AppIcon.iconset"

echo "Creating App Bundle structure in temporary directory..."
mkdir -p "$TEMP_BUILD_DIR/$APP_NAME/Contents/MacOS"
mkdir -p "$TEMP_BUILD_DIR/$APP_NAME/Contents/Resources"

cp "$TEMP_BUILD_DIR/IMDb Search Generator" "$TEMP_BUILD_DIR/$APP_NAME/Contents/MacOS/"
cp "$TEMP_BUILD_DIR/AppIcon.icns" "$TEMP_BUILD_DIR/$APP_NAME/Contents/Resources/"

cat << 'EOF' > "$TEMP_BUILD_DIR/$APP_NAME/Contents/Info.plist"
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

chmod +x "$TEMP_BUILD_DIR/$APP_NAME/Contents/MacOS/IMDb Search Generator"

echo "Installing compiled application directly to $HOME/Applications/..."
mkdir -p "$HOME/Applications"
rm -rf "$HOME/Applications/$APP_NAME"
cp -R "$TEMP_BUILD_DIR/$APP_NAME" "$HOME/Applications/"

# Refresh Finder icon cache
touch "$HOME/Applications/$APP_NAME"

# Cleanup temporary build files
rm -rf "$TEMP_BUILD_DIR"

echo "Successfully installed $APP_NAME to $HOME/Applications!"
echo "Project folder remains 100% clean source code only."
