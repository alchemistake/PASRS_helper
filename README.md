# PASRS Replay Helper
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Helper extension for PASRS & [Pokémon Showdown](https://play.pokemonshowdown.com/) that automatically uploads the replays of your battles and logs them into a PASRS Google Sheet — picks, leads, used Pokémon, Mega, Elo, OTS/CTS, Bo3 metadata and move usage.

Your replays are stored in session storage and can be seen in the side panel, where you can see the result and click them to copy the match URL.

## Features
- Automatic replay upload from Pokémon Showdown
- Google Sheets integration: parses each replay and fills a PASRS 7 tracker spreadsheet automatically
- Pick a team from your Showdown teambuilder (or a pokepaste URL) to populate the Usage Stats dashboard
- Auto-creates / self-heals the tracker in your Google Drive (only needs the non-sensitive `drive.file` scope)

## Installation

### Firefox
1. Download the latest signed `.xpi` from the [Releases](../../releases) page.
2. Open Firefox and either drag the `.xpi` onto the browser window, or go to `about:addons` → gear icon → **Install Add-on From File…** and select it.
3. Confirm the install. The add-on is Mozilla-signed, so it stays installed permanently.

### Chrome
Chrome can't install `.xpi` files. Use one of these:

**From the Chrome Web Store** (recommended once published) — install with one click; auto-updates included.

**Manual / unpacked install:**
1. Download the `chrome` build `.zip` from the [Releases](../../releases) page and unzip it.
2. Go to `chrome://extensions`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the unzipped folder.

> Note: unpacked installs don't auto-update, and Google sign-in requires the extension's registered OAuth redirect URI — use the Web Store build for full functionality.

## Building from source

- Install [Bun](https://bun.sh/)
- Clone the repo and run `bun install`
- Run `npm run build` for Chrome or `npm run build:firefox` for Firefox
