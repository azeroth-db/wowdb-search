#!/bin/sh
# Builds dist/wowdb-search-<version>.zip (Chrome Web Store, Edge, Opera, Whale: manifest.json at the zip root)
# and dist/wowdb-search-<version>-firefox.zip (Firefox Add-ons: background script instead of a service worker).
set -eu
cd "$(dirname "$0")"
version=$(python3 -c 'import json;print(json.load(open("manifest.json"))["version"])')
mkdir -p dist
rm -f "dist/wowdb-search-$version.zip" "dist/wowdb-search-$version-firefox.zip"
zip -qrX "dist/wowdb-search-$version.zip" manifest.json background.js icons _locales
stage=$(mktemp -d "$PWD/dist/.firefox-package.XXXXXX")
trap 'rm -rf "$stage"' EXIT HUP INT TERM
cp -R background.js icons _locales "$stage"
python3 - "$stage/manifest.json" <<'PY'
import json, sys
m = json.load(open("manifest.json"))
m["background"] = {"scripts": ["background.js"]}
m["browser_specific_settings"] = {"gecko": {"id": "extension@wowdb.wiki", "strict_min_version": "142.0",
                                           "data_collection_permissions": {"required": ["searchTerms", "websiteContent"]}}}
json.dump(m, open(sys.argv[1], "w"), indent=2, ensure_ascii=False)
PY
(cd "$stage" && zip -qrX "$OLDPWD/dist/wowdb-search-$version-firefox.zip" manifest.json background.js icons _locales)
echo "dist/wowdb-search-$version.zip"
echo "dist/wowdb-search-$version-firefox.zip"
