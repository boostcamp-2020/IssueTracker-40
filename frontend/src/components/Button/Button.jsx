import React from "react";
import styled, { css } from "styled-components";
import { color } from "@style/color";

const Btn = styled.button`
    background-color: ${color.btn_bg};
    border-radius: 6px;
    color: ${color.btn_text};
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    line-height: 20px;
    padding: 5px 16px;
    border: 1px solid ${color.btn_primary_border};
    box-shadow: 0 1px 0 ${color.btn_primary_shadow};
    transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
    transition-property: color, background-color, border-color;

    &:hover {
        background-color: ${color.btn_hover_bg};
        transition-duration: 0.1s;
    }

    ${(props) =>
        props.primary &&
        css`
            background-color: ${color.btn_primary_bg};
            color: ${color.btn_primary_text};
            border: 1px solid;

            &:hover {
                background-color: ${color.btn_primary_hover_bg};
            }
        `}
`;

const Button = ({ children, ...rest }) => {
    return <Btn {...rest}> {children} </Btn>;
};

export default Button;
