import React from "react";
import styled, { css } from "styled-components";
import { Remarkable } from "remarkable";
import { color } from "@style/color";

const PreviewContainer = styled.div`
    min-height: 150px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: white;
    font-size: auto;
    padding-left: 10px;
    border-bottom: 2px solid ${color.border_primary};
    ${(props) =>
        props.selected &&
        css`
            display: none;
        `}
`;

const View = styled.div`
    padding: 0px;
`;

const TabMenu = ({ text, selected }) => {
    const md = new Remarkable();
    const getRawMarkup = () => {
        return {
            __html: md.render(text)
        };
    };
    return (
        <PreviewContainer selected={selected}>
            {text === "" ? "Nothing to preview" : ""}
            <View dangerouslySetInnerHTML={getRawMarkup()} />
        </PreviewContainer>
    );
};

export default TabMenu;
