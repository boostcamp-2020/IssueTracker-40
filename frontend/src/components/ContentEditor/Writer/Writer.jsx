import React, { useRef } from "react";
import styled, { css } from "styled-components";
import { color } from "@style/color";

const WriterContainer = styled.div`
    margin: 10px;
    padding: 0px;
    width: 500px;
    border-radius: 10px;
    font-size: 13px;
    color: ${color.textarea_text};
    background-color: ${color.textarea_bg};
    border: 1px solid ${color.textarea_border};

    &:focus {
        background-color: white;
        border: 1px solid red;
    }
    ${(props) =>
        props.selected &&
        css`
            display: none;
        `}
`;

const WriterTextarea = styled.textarea`
    padding: 10px;
    width: 480px;
    height: 90px;
    min-height: 90px;
    max-height: 300px;
    font-size: 13px;
    background-color: ${color.textarea_bg};
    border-radius: 10px 10px 0px 0px;
    border: none;
    border-bottom: 1px dashed ${color.textarea_border};
    outline: none;
    resize: vertical;
    &:focus {
        background-color: white;
        border-bottom: 1px dashed ${color.textarea_focus_border};
    }
`;

const WriterDropAndDropZone = styled.div`
    padding: 10px;
    width: 460px;
    height: 20px;
    border-radius: 0px 0px 10px 10px;
    cursor: pointer;
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const Writer = ({ setText, selected }) => {
    const HiddenFileInputEl = useRef(null);
    const WriterContainerEl = useRef(null);

    const handlingClickDropZone = () => {
        HiddenFileInputEl.current.click();
    };

    const onFocus = () => {
        const containerStyle = WriterContainerEl.current.style;
        containerStyle.boxShadow = "inset 0 1px 2px rgba(27,31,35,0.075), 0 0 0 3px rgba(3,102,214,0.3)";
        containerStyle.border = `1px solid ${color.textarea_focus_border}`;
    };

    const onBlur = () => {
        const containerStyle = WriterContainerEl.current.style;
        containerStyle.boxShadow = "none";
        containerStyle.border = `1px solid ${color.textarea_border}`;
    };

    return (
        <WriterContainer ref={WriterContainerEl} selected={selected}>
            <WriterTextarea onChange={setText} onFocus={onFocus} onBlur={onBlur} placeholder="Leave a comment" />
            <WriterDropAndDropZone onClick={handlingClickDropZone}>
                <p> Attach files by dragging & dropping, selecting or pasting them. </p>
            </WriterDropAndDropZone>
            <HiddenFileInput ref={HiddenFileInputEl} type="file" multiple />
        </WriterContainer>
    );
};

export default Writer;
