import React from "react";
import styled from "styled-components";

const defineTextColor = (color) => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "black" : "white";
};

const StyledLabel = styled.button`
    background-color: ${(props) => props.color};
    color: ${(props) => defineTextColor(props.color)};
    border-radius: 1rem;
    font-size: 10px;
    line-height: 2;
    font-weight: bold;
    cursor: pointer;
    border: none;
    margin-left: 2.5px;
    margin-right: 2.5px;
    padding-left: 10px;
    padding-right: 10px;
    &:hover {
        text-decoration: underline;
    }
`;

const Label = ({ children, ...rest }) => {
    return <StyledLabel {...rest}> {children} </StyledLabel>;
};

export default Label;
