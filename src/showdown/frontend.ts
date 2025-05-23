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
        <fieldset id="pasrs_settings">
            <legend>Settings:</legend>
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

    createSettingsControllers();
    createCustomVsVGC();
    hideShowCustomFilter();
}

function createSettingsControllers() {
    const autoPlaySettingsLabels: Record<keyof AutoReplaySettings, string> = {
        active: "Enable Automatic Replay Upload",
        use_clipboard: "Put new replays to Clipboard",
        notifications: "Enable Upload Done Notifications",
        vgc_only: "Only Upload VGC Replays",
        use_custom_replay_filter: "Use Custom Replay Filter: disables the vgc only option",
        custom_replay_filter: "Custom Replay Filter",
    };
    for (const [key, label] of Object.entries(autoPlaySettingsLabels)) {
        const settingsKey = key as keyof AutoReplaySettings;
        const settingsValue = autoPlaySettings[settingsKey];

        if (typeof settingsValue === "boolean") {
            const element = $(`<div id="${settingsKey}_container">
            <input type="checkbox" id="${settingsKey}" name="${settingsKey}" ${settingsValue ? "checked" : ""}/>
            <label for="${settingsKey}">${label}</label>
            </div>`);
            $("#pasrs_settings").append(element);

            bindCheckboxSetting(`#${settingsKey}`, settingsKey);
        }
        if (typeof settingsValue === "string") {
            const element = $(`<div id="${settingsKey}_container">
            <label for="${settingsKey}">${label}</label>
            <input type="text" id="${settingsKey}" name="${settingsKey}" value="${settingsValue}"/>
            </div>`);
            $("#pasrs_settings").append(element);

            bindTextSetting(`#${settingsKey}`, settingsKey);
        }
    }
}

function bindCheckboxSetting(selector: string, settingKey: keyof AutoReplaySettings) {
    const element = $(selector);
    element.on("change", null, null, (event: JQuery.ChangeEvent) => {
        const item = event.target as HTMLInputElement;
        // @ts-ignore : slapping ts ignore since we gonna replace this in 2-3 weeks at most
        autoPlaySettings[settingKey] = item.checked;
        updateSettings();
    });
}

function bindTextSetting(selector: string, settingKey: keyof AutoReplaySettings) {
    const element = $(selector);
    element.on("change", null, null, (event: JQuery.ChangeEvent) => {
        const item = event.target as HTMLInputElement;
        // @ts-ignore : slapping ts ignore since we gonna replace this in 2-3 weeks at most
        autoPlaySettings[settingKey] = item.value;
        updateSettings();
    });
}

function createCustomVsVGC() {
    for (const [fromKey, toKey] of [["vgc_only", "use_custom_replay_filter"], ["use_custom_replay_filter", "vgc_only"]] as const) {
        const vgc = $(`#${fromKey}`);
        vgc.on("change", null, null, (event: JQuery.ChangeEvent) => {
            const item = event.target as HTMLInputElement;
            if (item.checked) {
                $(`#${toKey}`).prop("checked", false);
            }
            autoPlaySettings[toKey] = false;
            updateSettings();
        });
    }
}

function hideShowCustomFilter() {
    const customReplayFilter = $("#custom_replay_filter_container");
    const useCustomReplayFilter = $("#use_custom_replay_filter");

    useCustomReplayFilter.on("change", null, null, (event: JQuery.ChangeEvent) => {
        const item = event.target as HTMLInputElement;
        if (item.checked) {
            customReplayFilter.show();
        } else {
            customReplayFilter.hide();
        }
    });

    if (useCustomReplayFilter.is(":checked")) {
        customReplayFilter.show();
    } else {
        customReplayFilter.hide();
    }
}

export { createPASRSRoom };