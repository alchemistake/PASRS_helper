import React from 'react';
import { SettingsKey } from '../../../types/settings';
import './SettingsCheckBox.scss';


interface SettingsCheckboxProps {
	settingsKey: SettingsKey;
	label: string;
	checked: boolean;
	onChange: (key: SettingsKey, value: boolean) => void;
	disabled?: boolean;
}

const SettingsCheckbox: React.FC<SettingsCheckboxProps> = ({
	settingsKey,
	label,
	checked,
	onChange,
	disabled
}) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		onChange(settingsKey, event.target.checked);
	};

	return (
		<div className="settings-checkbox">
			<input
				type="checkbox"
				checked={checked}
				onChange={handleChange}
				disabled={disabled}
			/>
			<span>{label}</span>
		</div>
	);
};

export default SettingsCheckbox;