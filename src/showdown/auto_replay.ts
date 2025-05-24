export class AutoReplaySettings {
	active: boolean = false;
	notifications: boolean = true;
	vgc_only: boolean = true;
	use_clipboard: boolean = true;
	use_custom_replay_filter: boolean = false;
	custom_replay_filter: string = "";

	constructor(json: string | null) {
		if (!json) return;

		try {
			const options = JSON.parse(json);
			Object.assign(this, options);
		} catch (e) {
			console.error("Failed to parse AutoReplaySettings JSON:", e);
		}
	}
}