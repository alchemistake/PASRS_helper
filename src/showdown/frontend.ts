import { createHtmlRoom } from "./room";
import { AutoReplaySettings } from "./auto_replay";
import { autoPlaySettings, updateSettings } from "./storage";

// @ts-ignore : VERSION is injected by the bundler
const VERSION_TEXT = VERSION;

function createPASRSRoom() {
	const room = createHtmlRoom("view-pasrs-helper", "PASRS", {
		side: true,
		icon: "clipboard",
		focus: true,
	});

	if (room === null) {
		return;
	}

	room.$el.html(`
    <div style="padding: 2vh 5vw">
        <h1>PASRS Helper v${VERSION_TEXT}</h1>
        This is the settings tab for the PASRS Helper.
        Automatically uploads the replay of your last battle in PSD then it will be copied to your clipboard.
        <br /><br />
        <fieldset>
            <legend>Settings:</legend>

            <div>
                <input type="checkbox" id="activation" name="activation" ${autoPlaySettings.active ? "checked" : ""}/>
                <label for="activation">Enable</label>
            </div>

            <div>
                <input type="checkbox" id="notification" name="notification" ${autoPlaySettings.notifications ? "checked" : ""}/>
                <label for="notification">Send notifications</label>
            </div>

            <div>
                <input type="checkbox" id="vgc_only" name="vgc_only" ${autoPlaySettings.vgc_only ? "checked" : ""}/>
                <label for="vgc_only">Save replays for VGC Only</label>
            </div>
        </fieldset>

        <br />
        <p><b>Maintainers:</b> <a href="https://twitter.com/alchemistake" target="_blank">Alchemistake</a> <a href="https://x.com/PokeBin_dev" target="_blank">PokeBin Dev</a></p>
        <p><a href="https://www.patreon.com/malaow3" target="_blank">Support PokeBin Dev on Patreon!</a></p>
        <br />
        <a href="https://github.com/alchemistake/PASRS_helper" target="_blank">Source Code</a>
        <a href="https://twitter.com/alchemistake" target="_blank">Tweet me the issues</a>

        <h1>Games</h1>
        <ul id="pasrs_games"></ul>
    </div>
  `);

	bindCheckboxSetting("#activation", "active");
	bindCheckboxSetting("#notification", "notifications");
	bindCheckboxSetting("#vgc_only", "vgc_only");
}

function bindCheckboxSetting(selector: string, settingKey: keyof AutoReplaySettings) {
	const element = $(selector);
	element.on("change", null, null, (event: JQuery.ChangeEvent) => {
		const item = event.target as HTMLInputElement;
		autoPlaySettings[settingKey] = item.checked;
		updateSettings();
	});
}

export { createPASRSRoom };