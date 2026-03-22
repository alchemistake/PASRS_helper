import { useCallback, useEffect, useState } from 'react';
import { onFormatsUpdated, onSettingsUpdated } from '../lib/events';
import { SettingsManager } from '../lib/storage/settings-manager';
import type { Settings } from '../types/settings';

type SettingsValue = Settings[keyof Settings];

export const useSettings = () => {
	const settingsManager = SettingsManager.getInstance();

	const [settings, setSettings] = useState(() => settingsManager.getSettings());

	const [customFormats, setCustomFormats] = useState(() =>
		settingsManager.getCustomFormats(),
	);

	const updateSetting = useCallback(
		(key: keyof Settings, value: SettingsValue) => {
			settingsManager.updateSetting(key, value);
			// State will be updated via the event listener
		},
		[settingsManager],
	);

	useEffect(() => {
		const removeFormatsListener = onFormatsUpdated((formats) => {
			setCustomFormats([...formats]);
		});

		const removeSettingsListener = onSettingsUpdated((updatedSettings) => {
			setSettings({ ...updatedSettings });
		});

		return () => {
			removeFormatsListener();
			removeSettingsListener();
		};
	}, []);

	return { settings, updateSetting, customFormats };
};
