export class AutoReplaySettings {
	active: boolean = false;
	notifications: boolean = true;
	vgc_only: boolean = true;

	constructor(json: string | null) {
		if (!json) return;

		const options = JSON.parse(json) as AutoReplaySettings;
		this.active = options.active;
		this.notifications = options.notifications;
		this.vgc_only = options.vgc_only;
	}
}