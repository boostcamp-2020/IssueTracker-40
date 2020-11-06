import React from "react";
import styled from "styled-components";

const defineTextColor = (color) => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance > 0.5) return "black";
    return "white";
};

const StyledLabel = styled.button`
    background-color: ${(props) => props.color};
    color: ${(props) => defineTextColor(props.color)};
    border-radius: 1rem;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    line-height: 20px;
    padding: 5px 16px;
    border: none;
    &:hover {
        text-decoration: underline;
    }
`;

const Label = ({ children, ...rest }) => {
    return <StyledLabel {...rest}> {children} </StyledLabel>;
};

export default Label;
