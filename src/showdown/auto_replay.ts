export class AutoReplaySettings {
	active: boolean = false;
	notifications: boolean = true;
	vgc_only: boolean = true;
	use_clipboard: boolean = true;
	use_custom_replay_filter: boolean = false;
	custom_replay_filter: string = "";

	constructor(json: string | null) {
		if (!json) return;

		const options = JSON.parse(json) as AutoReplaySettings;
		for (const key in options) {
			key as keyof AutoReplaySettings;
			if (key in this) {
				// @ts-ignore
				(this)[key] = options[key];
			}
		}
		// this.active = options.active;
		// this.notifications = options.notifications;
		// this.vgc_only = options.vgc_only;
		// this.use_custom_replay_filter = options.use_custom_replay_filter;
		// this.custom_replay_filter = options.custom_replay_filter;
		// this.use_clipboard = options.use_clipboard;
	}
}