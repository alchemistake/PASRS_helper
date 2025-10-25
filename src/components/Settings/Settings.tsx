import { SettingsKey } from '../../types/settings';
import './Settings.scss';
import { useSettings } from '../../hooks/useSettings';
import SettingsCheckbox from '../ui/SettingsCheckbox/SettingsCheckBox';
import { SettingsFormatSelect } from '../ui/SettingsFormatSelect/SettingsFormatSelect';


// @ts-ignore : VERSION is injected by the bundler
const VERSION_TEXT = VERSION;

const Settings = () => {
	const { settings, updateSetting, customFormats } = useSettings();

	const handleCheckboxChange = (key: SettingsKey, value: boolean): void => {
		updateSetting(key, value);
	};

	const handleFormatSelectChange = (key: SettingsKey, value: string[]): void => {
		updateSetting(key, value);
	};

	return (
		<div className="settings">
			<h3>Settings</h3>

			<section className="settings-group">
				<SettingsCheckbox settingsKey="active" label="Enable Automatic Replay Upload"
					checked={settings.active} onChange={handleCheckboxChange} />

				<SettingsCheckbox settingsKey="use_clipboard" label="Put new replays in clipboard"
					checked={settings.use_clipboard} onChange={handleCheckboxChange} />

				<SettingsCheckbox settingsKey="notifications" label="Enable Upload Done Notifications"
					checked={settings.notifications} onChange={handleCheckboxChange} />
			</section>

			<hr />

			<section className="settings-group">
				<span>Replay Filtering</span>

				<SettingsCheckbox settingsKey="vgc_only" label="VGC Mode (Only save VGC replays)"
					checked={settings.vgc_only} onChange={handleCheckboxChange} disabled={settings.use_custom_replay_filter} />

				<SettingsCheckbox settingsKey="use_custom_replay_filter" label="Use Custom Replay Filter"
					checked={settings.use_custom_replay_filter} onChange={handleCheckboxChange} disabled={settings.vgc_only} />

				<SettingsFormatSelect
					settingsKey="custom_replay_filter"
					value={settings.custom_replay_filter}
					customFormats={customFormats}
					onChange={handleFormatSelectChange}
					disabled={!settings.use_custom_replay_filter}
				/>
			</section>

			<hr style={{ margin: 'auto 0 16px' }} />

			<section className="info-section">
				<button onClick={openCreditsPage}>
					<i className="fa fa-heart" aria-hidden="true"></i>
					Credits
				</button>
				<button onClick={openIssuesPage}>
					<i className="fa fa-bug" aria-hidden="true"></i>
					Report Bug
				</button>
				<span className='version-label'>version {VERSION_TEXT}</span>
			</section>
		</div>
	);
};

const openIssuesPage = (): void => {
	window.open('https://github.com/alchemistake/PASRS_helper/issues', '_blank');
};

const openCreditsPage = (): void => {
	window.open('https://github.com/alchemistake/PASRS_helper/tree/main?tab=contributing-ov-file#maintainers--credits', '_blank');
}

export default Settings;
