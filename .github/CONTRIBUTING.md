# Contributing to PASRS Helper
Thank you for your interest in contributing to PASRS Helper! We welcome contributions from the community to help improve the project. 

Please follow the guidelines below to ensure a smooth contribution process.

## How to Contribute
1. **Fork the Repository**: Start by forking the PASRS Helper repository to your own GitHub account.
2. **Create a New Branch**: Create a new branch for your feature or bug fix.
3. **Make Changes**: Make your changes in the new branch.
4. **Create a Pull Request**: Open a pull request from your branch to the main repository's main branch.
5. **Describe Your Changes**: Provide a clear description of the changes you made and why they are necessary.


## Google Sheets Integration
PASRS Helper fills in your **PASRS 4.3** tracker for every recorded replay using
OAuth and the official Google Sheets API. Users sign in with their Google account
from the settings panel; data goes directly from the extension to Google's API
(no third party in between).

The PASRS template's dashboards (Game By Game, Usage Stats, Matchup Stats, Lead
Combos, Move Usage, …) are all driven by **plain spreadsheet formulas**. Those
formulas read from two source areas that are normally produced by the template's
bound Apps Script functions:

- `=REPLAYTODATA(replayURL)` → one row per game in the `Base Data` sheet.
- `=TEAMDATAFROMPASTE(pasteURL)` → your team down column A of `Team Info From Paste`.

When the sheet is exported as xlsx (so it can be imported without the bound
script), those two custom functions become `#NAME?` — but every other formula
survives. So the extension **reproduces those two functions itself** and writes
their output straight into the source areas; the template's formulas then render
every dashboard identically, no Apps Script required.

- `src/lib/sheets/replay-to-data.ts` — faithful port of `REPLAYTODATA`. The
  background fetches `<replay>.json`, parses the battle, and writes the resulting
  spill row to `Base Data!B<row>:CT<row>` (helper columns from `CU` on are left
  untouched). Game row N pairs with replay-link row N on the HomePage.
- `src/lib/sheets/team-from-paste.ts` — faithful port of `TEAMDATAFROMPASTE`. The
  background fetches the pokepaste HTML and writes the team down `Team Info From
  Paste!A`.

The first time the extension touches a spreadsheet it clears the `#NAME?`
custom-function cells (`Base Data!B3:CT102`, `Team Info From Paste!A1:A100`) so
unfilled rows render blank instead of poisoning the dashboards. This is
data-safe — it only clears when `Base Data!B3` is empty or an error.

### How it's wired (for contributors)
The page-injected scripts cannot use `chrome.*`, and OAuth can only run in a
background context, so requests hop through three contexts:

```
page (React panel / showdown hook)
  --window.postMessage-->  content script (src/extension/index.ts)
  --chrome.runtime.sendMessage-->  background worker (src/background/index.ts)
  --> chrome.identity.launchWebAuthFlow --> Sheets API
```

- `src/lib/events.ts` — the page<->content RPC (`sheetsRequest` / `onSheetsRequest`).
- `src/lib/showdown/showdown.ts` — on a recorded replay, sends the replay URL + your Showdown name.
- `src/background/index.ts` — OAuth + Sheets/Drive API. Handles `auth`, `status`,
  `signout`, `log` (parse a replay → `Base Data`), `team` (parse a pokepaste →
  `Team Info From Paste`) and `create` (Drive-upload the bundled template).
- `src/components/ui/SheetsSettings.tsx` — sign-in UI, spreadsheet ID, "Create
  tracker" button, team pokepaste URL + "Update team in sheet" button.

The tracker is auto-created by uploading the bundled `assets/pasrs-template.xlsx` to
Drive and converting it to a Google Sheet (`files.create`, multipart). This only
needs the `drive.file` scope (the extension is creating the file). If no
spreadsheet ID is set when a replay is recorded, one is created automatically.

Auth uses `chrome.identity.launchWebAuthFlow` (the OAuth popup) on **every**
browser — Chrome, Chromium forks (Brave, Edge, …) and Firefox. We deliberately
do **not** use `chrome.identity.getAuthToken`: it only works reliably in Google
Chrome and needs a different client type. One web flow means one OAuth client
and one code path.

### Developer setup: Google Cloud OAuth client (required)
The extension ships with a placeholder `client_id` in `manifest.base.json`. To
make sign-in work you must create your own OAuth client:

1. In the [Google Cloud Console](https://console.cloud.google.com), create a
   project and **enable the Google Sheets API and the Google Drive API**
   (APIs & Services → Library).
2. Configure the **OAuth consent screen** (External). Add the scopes
   `https://www.googleapis.com/auth/spreadsheets` and
   `https://www.googleapis.com/auth/drive.file`. While unverified, add yourself
   under **Test users**.
3. Create an **OAuth client ID** of type **Web application** (the same single
   client works for all browsers).
4. Add the extension's redirect URL(s) under **Authorized redirect URIs**. The
   value comes from `chrome.identity.getRedirectURL()` and differs per browser —
   load the unpacked build and read it from the background console:
   - Chromium: `https://<extension-id>.chromiumapp.org/`
   - Firefox: `https://<id>.extensions.allizom.org/` (stable because the build
     pins `browser_specific_settings.gecko.id`)

   Add one entry per browser you'll run.
5. Replace `client_id` in `manifest.base.json` with the generated value, then
   `npm run build:chrome` (or `build:firefox`). The Firefox build automatically
   converts the background to the `scripts` form Firefox MV3 expects.

> Public distribution requires Google **app verification** for the sensitive
> Sheets scope (privacy policy, demo video, possibly a security assessment).
> Until verified, users see an "unverified app" warning and you're capped at
> ~100 test users.

### User setup
1. In the PASRS Helper side panel → **Settings → Google Sheets**, enable
   **Log recorded replays to Google Sheets** and click **Sign in with Google**.
2. Click **Create tracker** — the extension makes a fresh PASRS sheet in your
   Drive and fills in its ID automatically. (Alternatively, paste the ID of an
   existing PASRS sheet you imported into Google Sheets.)
3. Optionally paste your team's pokepaste URL and click **Update team in sheet**
   to populate the Usage Stats page.

From then on, each recorded replay is parsed by the extension and written into
`Base Data`, and the template's formulas update every dashboard. The settings
panel links to your tracker.

## Maintainers / Credits
The project is maintained by the following individuals:<br>
- [Blox](https://twitter.com/ItzMrBlox) · [Github](https://github.com/kasp470f)<br>
- [Alchemistake](https://twitter.com/alchemistake)<br> 
- [PokeBin Dev](https://twitter.com/PokeBinDev)<br>

and big thanks to [Showdex](https://github.com/doshidak/showdex) who provided the Room generation code.
