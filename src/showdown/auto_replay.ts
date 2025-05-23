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
				// @ts-ignore #TODO: Fix this
				(this)[key] = options[key];
			}
		}
	}
}