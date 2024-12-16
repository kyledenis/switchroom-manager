import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "../../contexts/ThemeContext";

const Background = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background-color: ${(props) =>
        props.theme === "dark" ? "#1c1c1e" : "#ffffff"};
    background-image: radial-gradient(
        circle at 1px 1px,
        ${(props) =>
                props.theme === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)"}
            2px,
        transparent 0
    );
    background-size: 40px 40px;
    pointer-events: none;
    transition: all 0.3s ease;
    opacity: ${(props) => (props.theme === "dark" ? 0.8 : 0.4)};
`;

const DotGridBackground = () => {
    const { theme } = useTheme();
    return <Background theme={theme} />;
};

export default DotGridBackground;
