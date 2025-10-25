import React, { useState, useRef, useEffect } from 'react';
import { SettingsKey } from '../../../types/settings';
import './SettingsFormatSelect.scss';

interface SettingsFormatSelectProps {
    settingsKey: SettingsKey;
    value: string[];
    customFormats: string[];
    onChange: (key: SettingsKey, value: string[]) => void;
    disabled?: boolean;
}

const SettingsFormatSelect: React.FC<SettingsFormatSelectProps> = ({
    settingsKey,
    value,
    customFormats,
    onChange,
    disabled
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredFormats = customFormats.filter(format =>
        format.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleOption = (format: string): void => {
        const newValue = value.includes(format)
            ? value.filter(v => v !== format)
            : [...value, format];
        onChange(settingsKey, newValue);
    };

    const handleClickOutside = (event: MouseEvent): void => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayText = value.length === 0 
        ? 'Select formats...'
        : value.length === 1
        ? value[0]
        : `${value.length} formats selected`;

    return (
        <div className="settings-format-select" ref={dropdownRef}>
            <div 
                className={`select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className="select-value">{displayText}</span>
                <span className={`select-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && !disabled && (
                <div className="select-dropdown">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search formats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    
                    <div className="options-container">
                        {filteredFormats.length === 0 ? (
                            <div className="no-options">No formats found</div>
                        ) : (
                            filteredFormats.map((format) => (
                                <div
                                    key={format}
                                    className="option-item"
                                    onClick={() => handleToggleOption(format)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.includes(format)}
                                        onChange={() => {}} // Handled by onClick
                                        className="option-checkbox"
                                    />
                                    <span className="option-label">{format}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export { SettingsFormatSelect };