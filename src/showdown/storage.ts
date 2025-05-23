import { AutoReplaySettings } from "./auto_replay";

let autoPlaySettings: AutoReplaySettings = new AutoReplaySettings(localStorage.getItem("auto_replay_settings"));
const updateSettings = () => localStorage.setItem("auto_replay_settings", JSON.stringify(autoPlaySettings));
updateOldSettings();

// Leave this code for a while, until we are sure that the code is not needed anymore.
// This code is for updating the old settings to the new format. After a while, we can remove this code.
function updateOldSettings(): void {
    let active = localStorage.getItem("auto_replay_active");
    let notifications = localStorage.getItem("auto_replay_notifications");
    let vgc_only = localStorage.getItem("auto_replay_vgc_only");

    if (active !== null) {
        autoPlaySettings.active = active === "true";
        localStorage.removeItem("auto_replay_active");
    }
    if (notifications !== null) {
        autoPlaySettings.notifications = notifications === "true";
        localStorage.removeItem("auto_replay_notifications");
    }
    if (vgc_only !== null) {
        autoPlaySettings.vgc_only = vgc_only === "true";
        localStorage.removeItem("auto_replay_vgc_only");
    }
    if (active !== null || notifications !== null || vgc_only !== null) {
        updateSettings();
    }
}

export { autoPlaySettings, updateSettings };