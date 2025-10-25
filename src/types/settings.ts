export interface Settings {
    active: boolean;
	notifications: boolean;
	vgc_only: boolean;
	use_clipboard: boolean;
	use_custom_replay_filter: boolean;
	custom_replay_filter: string[];
}


export type SettingsKey = keyof Settings;