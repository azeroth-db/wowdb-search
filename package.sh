#!/bin/sh
# Builds dist/wowdb-search-<version>.zip with manifest.json at the zip root, the layout the Chrome Web Store takes.
set -eu
cd "$(dirname "$0")"
version=$(python3 -c 'import json;print(json.load(open("manifest.json"))["version"])')
mkdir -p dist
rm -f "dist/wowdb-search-$version.zip"
zip -qrX "dist/wowdb-search-$version.zip" manifest.json background.js icons _locales
echo "dist/wowdb-search-$version.zip"
