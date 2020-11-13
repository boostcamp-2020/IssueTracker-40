import React from "react";
import styled from "styled-components";

const StyledProgressBar = styled.progress`
    -webkit-appearance: none;
    width: 95%;
    height: 8px;
    border-radius: 4px;
    ::-webkit-progress-bar {
        background-color: #eeeeee;
        border-radius: 4px;
    }
    ::-webkit-progress-value {
        background-color: #34d058;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
`;

const ProgressBar = ({ children, value, max }) => {
    return (
        <StyledProgressBar value={value} max={max}>
            {children}
        </StyledProgressBar>
    );
};

export default ProgressBar;
