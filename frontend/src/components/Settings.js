import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Switch, FormControlLabel, Typography, Divider } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MapIcon from '@mui/icons-material/Map';
import SpeedIcon from '@mui/icons-material/Speed';
import TuneIcon from '@mui/icons-material/Tune';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { useTheme } from '../contexts/ThemeContext';

const SettingsContainer = styled.div`
    padding: 24px;
    padding-top: 104px;
    min-height: 100vh;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    max-width: 800px;
    margin: 0 auto;
`;

const SettingSection = styled.div`
    margin-bottom: 32px;
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 16px;
    padding: 24px;
`;

const SectionTitle = styled(Typography)`
    font-size: ${props => props.variant === 'h6' ? '24px' : '18px'};
    font-weight: 600;
    margin-bottom: 16px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    display: flex;
    align-items: center;
    gap: 12px;

    svg {
        opacity: 0.7;
    }
`;

const SettingItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    &:first-of-type {
        padding-top: 0;
    }

    .MuiFormControlLabel-root {
        margin: 0;
        color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    }

    .MuiSwitch-root {
        margin-right: 8px;
    }

    svg {
        font-size: 20px;
        opacity: 0.7;
        color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    }
`;

const SettingDescription = styled(Typography)`
    color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
    font-size: 14px;
    margin-top: 4px;
`;

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const [autoSave, setAutoSave] = useState(true);
    const [showLabels, setShowLabels] = useState(true);
    const [autoCenter, setAutoCenter] = useState(true);
    const [quickAnimation, setQuickAnimation] = useState(false);

    const handleThemeChange = (event) => {
        setTheme(event.target.checked ? 'dark' : 'light');
    };

    return (
        <SettingsContainer theme={theme}>
            <SettingSection theme={theme}>
                <SectionTitle variant="h6" theme={theme}>
                    <TuneIcon /> Application Settings
                </SectionTitle>

                <SettingItem theme={theme}>
                    <div>
                        <Typography>Theme Mode</Typography>
                        <SettingDescription theme={theme}>
                            Switch between dark and light theme
                        </SettingDescription>
                    </div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={theme === 'dark'}
                                onChange={handleThemeChange}
                                color="primary"
                            />
                        }
                        label={`${theme === 'dark' ? 'Dark' : 'Light'}`}
                    />
                </SettingItem>

                <SettingItem theme={theme}>
                    <div>
                        <Typography>Auto-Save Changes</Typography>
                        <SettingDescription theme={theme}>
                            Automatically save changes while editing
                        </SettingDescription>
                    </div>
                    <Switch
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                        color="primary"
                    />
                </SettingItem>
            </SettingSection>

            <SettingSection theme={theme}>
                <SectionTitle variant="subtitle1" theme={theme}>
                    <MapIcon /> Map Preferences
                </SectionTitle>

                <SettingItem theme={theme}>
                    <div>
                        <Typography>Show Switchroom Labels</Typography>
                        <SettingDescription theme={theme}>
                            Display labels on the map for switchrooms
                        </SettingDescription>
                    </div>
                    <Switch
                        checked={showLabels}
                        onChange={(e) => setShowLabels(e.target.checked)}
                        color="primary"
                    />
                </SettingItem>

                <SettingItem theme={theme}>
                    <div>
                        <Typography>Auto-Center on Selection</Typography>
                        <SettingDescription theme={theme}>
                            Center map on selected switchroom
                        </SettingDescription>
                    </div>
                    <Switch
                        checked={autoCenter}
                        onChange={(e) => setAutoCenter(e.target.checked)}
                        color="primary"
                    />
                </SettingItem>

                <SettingItem theme={theme}>
                    <div>
                        <Typography>Quick Animations</Typography>
                        <SettingDescription theme={theme}>
                            Use faster map transitions
                        </SettingDescription>
                    </div>
                    <Switch
                        checked={quickAnimation}
                        onChange={(e) => setQuickAnimation(e.target.checked)}
                        color="primary"
                    />
                </SettingItem>
            </SettingSection>
        </SettingsContainer>
    );
};

export default Settings;