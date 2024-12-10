import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const SettingsContainer = styled.div`
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
`;

const SettingSection = styled.div`
    background: white;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    margin: 0 0 16px 0;
    color: #333;
`;

const SettingRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }
`;

const SettingLabel = styled.div`
    font-size: 14px;
    color: #555;
`;

const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;

    input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    span {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;

        &:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
    }

    input:checked + span {
        background-color: #2196F3;
    }

    input:checked + span:before {
        transform: translateX(24px);
    }
`;

function Settings() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <SettingsContainer>
            <h1>Settings</h1>

            <SettingSection>
                <SectionTitle>Appearance</SectionTitle>
                <SettingRow>
                    <SettingLabel>Dark Mode</SettingLabel>
                    <ToggleSwitch>
                        <input
                            type="checkbox"
                            checked={isDarkMode}
                            onChange={toggleTheme}
                        />
                        <span></span>
                    </ToggleSwitch>
                </SettingRow>
            </SettingSection>

            <SettingSection>
                <SectionTitle>Map Settings</SectionTitle>
                <SettingRow>
                    <SettingLabel>Show Area Labels</SettingLabel>
                    <ToggleSwitch>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onChange={(e) => {
                                // TODO: Implement area label toggle
                            }}
                        />
                        <span></span>
                    </ToggleSwitch>
                </SettingRow>
                <SettingRow>
                    <SettingLabel>Auto-center on Selection</SettingLabel>
                    <ToggleSwitch>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onChange={(e) => {
                                // TODO: Implement auto-center toggle
                            }}
                        />
                        <span></span>
                    </ToggleSwitch>
                </SettingRow>
            </SettingSection>

            <SettingSection>
                <SectionTitle>Notifications</SectionTitle>
                <SettingRow>
                    <SettingLabel>Show Toast Messages</SettingLabel>
                    <ToggleSwitch>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onChange={(e) => {
                                // TODO: Implement toast toggle
                            }}
                        />
                        <span></span>
                    </ToggleSwitch>
                </SettingRow>
            </SettingSection>
        </SettingsContainer>
    );
}

export default Settings;