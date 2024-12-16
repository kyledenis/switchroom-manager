import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Switch, FormControlLabel, Typography, Divider, Slider, Select, MenuItem, TextField } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MapIcon from '@mui/icons-material/Map';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import { useTheme } from '../../contexts/ThemeContext';

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

const StyledDivider = styled(Divider)`
    margin: 24px 0;
    background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const SettingControl = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const StyledSelect = styled(Select)`
    min-width: 120px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'} !important;

    .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} !important;
    }

    &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
    }

    .MuiSelect-icon {
        color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'} !important;
    }
`;

const StyledTextField = styled(TextField)`
    .MuiOutlinedInput-root {
        color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};

        .MuiOutlinedInput-notchedOutline {
            border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        }

        &:hover .MuiOutlinedInput-notchedOutline {
            border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
        }
    }

    .MuiInputLabel-root {
        color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
    }
`;

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();
    const [mapStyle, setMapStyle] = useState('hybrid');
    const [language, setLanguage] = useState('en');
    const [animationSpeed, setAnimationSpeed] = useState(1000);
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [dataRetention, setDataRetention] = useState(30);

    const handleThemeChange = (event) => {
        setTheme(event.target.checked ? 'dark' : 'light');
    };

    return (
        <SettingsContainer theme={theme}>
            <SettingSection theme={theme}>
                <SectionTitle variant="h6" theme={theme}>
                    <SecurityIcon /> General Settings
                </SectionTitle>
                <StyledDivider theme={theme} />

                <SettingSection theme={theme}>
                    <SectionTitle variant="subtitle1" theme={theme}>
                        <DarkModeIcon /> Appearance
                    </SectionTitle>
                    <SettingItem theme={theme}>
                        <div>
                            <Typography>Theme Mode</Typography>
                            <SettingDescription theme={theme}>
                                Choose between light and dark theme
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
                </SettingSection>

                <SettingSection theme={theme}>
                    <SectionTitle variant="subtitle1" theme={theme}>
                        <MapIcon /> Map Settings
                    </SectionTitle>
                    <SettingItem theme={theme}>
                        <div>
                            <Typography>Default Map Style</Typography>
                            <SettingDescription theme={theme}>
                                Choose the default map view style
                            </SettingDescription>
                        </div>
                        <StyledSelect
                            value={mapStyle}
                            onChange={(e) => setMapStyle(e.target.value)}
                            theme={theme}
                            size="small"
                        >
                            <MenuItem value="roadmap">Roadmap</MenuItem>
                            <MenuItem value="satellite">Satellite</MenuItem>
                            <MenuItem value="hybrid">Hybrid</MenuItem>
                            <MenuItem value="terrain">Terrain</MenuItem>
                        </StyledSelect>
                    </SettingItem>

                    <SettingItem theme={theme}>
                        <div>
                            <Typography>Animation Speed</Typography>
                            <SettingDescription theme={theme}>
                                Adjust the speed of map animations (ms)
                            </SettingDescription>
                        </div>
                        <Slider
                            value={animationSpeed}
                            onChange={(e, value) => setAnimationSpeed(value)}
                            min={500}
                            max={2000}
                            step={100}
                            sx={{ width: 120 }}
                        />
                    </SettingItem>
                </SettingSection>

                <SettingSection theme={theme}>
                    <SectionTitle variant="subtitle1" theme={theme}>
                        <LanguageIcon /> Language & Region
                    </SectionTitle>
                    <SettingItem theme={theme}>
                        <div>
                            <Typography>Language</Typography>
                            <SettingDescription theme={theme}>
                                Select your preferred language
                            </SettingDescription>
                        </div>
                        <StyledSelect
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            theme={theme}
                            size="small"
                        >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Español</MenuItem>
                            <MenuItem value="fr">Français</MenuItem>
                        </StyledSelect>
                    </SettingItem>
                </SettingSection>

                <SettingSection theme={theme}>
                    <SectionTitle variant="subtitle1" theme={theme}>
                        <NotificationsIcon /> Notifications
                    </SectionTitle>
                    <SettingItem theme={theme}>
                        <div>
                            <Typography>Push Notifications</Typography>
                            <SettingDescription theme={theme}>
                                Receive notifications about updates and changes
                            </SettingDescription>
                        </div>
                        <Switch
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            color="primary"
                        />
                    </SettingItem>
                </SettingSection>

                <SettingSection theme={theme}>
                    <SectionTitle variant="subtitle1" theme={theme}>
                        <StorageIcon /> Data Management
                    </SectionTitle>
                    <SettingItem theme={theme}>
                        <div>
                            <Typography>Auto-Save</Typography>
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

                    <SettingItem theme={theme}>
                        <div>
                            <Typography>Data Retention Period</Typography>
                            <SettingDescription theme={theme}>
                                Number of days to keep historical data
                            </SettingDescription>
                        </div>
                        <StyledTextField
                            type="number"
                            value={dataRetention}
                            onChange={(e) => setDataRetention(e.target.value)}
                            size="small"
                            theme={theme}
                            InputProps={{ inputProps: { min: 1, max: 365 } }}
                            sx={{ width: 120 }}
                        />
                    </SettingItem>
                </SettingSection>
            </SettingSection>
        </SettingsContainer>
    );
};

export default SettingsPage;