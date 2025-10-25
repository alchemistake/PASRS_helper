import { useState, useCallback, useEffect } from 'react';
import { SettingsManager } from '../lib/storage/settings-manager';
import { Settings } from '../types/settings';
import { onFormatsUpdated, onSettingsUpdated } from '../lib/events';

export const useSettings = () => {
    const settingsManager = SettingsManager.getInstance();
    
    const [settings, setSettings] = useState(() =>
        settingsManager.getSettings()
    );
    
    const [customFormats, setCustomFormats] = useState(() =>
        settingsManager.getCustomFormats()
    );

    const updateSetting = useCallback((key: keyof Settings, value: any) => {
        settingsManager.updateSetting(key, value);
        // State will be updated via the event listener
    }, [settingsManager]);

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
