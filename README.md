# azeroth.wiki browser extension

Search the WoW Forever database on [azeroth.wiki](https://azeroth.wiki) from Chrome:

- Type `wow`, a space and the name of an item, talent, spell, recipe, quest, dungeon or zone
  in the address bar. Suggestions come from azeroth.wiki's own search index.
- Select a name on any page, right-click and choose **Look up on azeroth.wiki**.

About the extension: [azeroth-db.github.io/extension.html](https://azeroth-db.github.io/extension.html)

## Install

Download the zip from the [latest release](https://github.com/azeroth-db/wowdb-search/releases/latest) and unpack it. In Chrome open
`chrome://extensions`, turn on Developer mode, choose **Load unpacked** and select the folder.

## What it uses

| Permission | Why |
|---|---|
| `contextMenus` | the Look up on azeroth.wiki item for selected text |
| `storage` | the names of azeroth.wiki's public search index, kept for a day for suggestions |
| `https://azeroth.wiki/*` | reading the search index from `https://azeroth.wiki/api/forever/search` |

It collects no data and sends nothing about you. Texts follow the browser's language in the
ten languages azeroth.wiki ships.

## Package

`./package.sh` writes `dist/wowdb-search-<version>.zip` with `manifest.json` at its root.
