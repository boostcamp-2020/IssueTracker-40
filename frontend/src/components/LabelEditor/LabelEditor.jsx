import React, { useRef, useState } from "react";
import styled from "styled-components";
import { color } from "@style/color";
import { Label, Button } from "@components";
import changeBlackIcon from "@imgs/change-black-icon.png";
import changeWhiteIcon from "@imgs/change-white-icon.png";
import { API } from "@utils";

const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: space-between;
    width: 100%;
    max-width: 1280px;
    margin-bottom: 1rem;
    background-color: ${(props) => (props.create ? color.tertiary_bg : "color.main_bg")};
    border: ${(props) => (props.create ? `1px solid ${color.tertiary_border}` : "none")};
    border-radius: ${(props) => (props.create ? "7px" : "none")};
    height: 10rem;
`;

const EditorContainerTop = styled.div`
    display: flex;
    height: 15%;
    margin-top: 1rem;
    margin-left: 1rem;
`;

const EditorContainerContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 2rem;
    width: ${(props) => props.width};
`;

const BoxContainer = styled.div`
    display: flex;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 4.5rem;
    margin-right: 1rem;
`;

const InnerBox = styled.div`
    display: flex;
`;

const Text = styled.p`
    font-weight: 500;
`;

const Input = styled.input`
    width: ${(props) => props.width};
    line-height: 2;
    margin-bottom: 1rem;
    background-color: ${color.title_input_bg};
    border: 1px solid ${color.title_input_border};
    border-radius: 7px;
    padding-left: 0.5rem;
    &:focus {
        background-color: ${color.main_bg};
        border: 1px solid ${color.title_input_focus_border};
        outline: none;
        box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075), 0 0 0 3px rgba(3, 102, 214, 0.3);
    }
`;

const ColorButton = styled.button`
    width: 2rem;
    height: 2rem;
    background-color: ${(props) => props.color};
    border-radius: 10px;
    margin-right: 0.5rem;
`;

const Icon = styled.img`
    width: 1rem;
    height: 1rem;
`;

const defineTextColor = (color) => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "black" : "white";
};

const LabelEditor = ({ create, buttonClick, ...rest }) => {
    const nameEl = useRef();
    const descriptionEl = useRef();
    const [name, setName] = useState(rest.name || "");
    const [description, setDescription] = useState(rest.description || "");
    const [labelColor, setLabelColor] = useState(rest.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`);
    const createLabel = async () => {
        await API.postLabel({ name, description, color: labelColor });
        window.location.reload();
    };
    const putLabel = async () => {
        await API.putLabel(rest.id, { name, description, color: labelColor });
        window.location.reload();
    };
    const handlingColorChange = (e) => {
        setLabelColor(e.target.value);
    };

    const handlingNameChange = (e) => {
        setName(e.target.value);
    };

    const handlingDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handlingColorButtonClick = () => {
        const newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setLabelColor(newColor);
    };

    return (
        <EditorContainer create={create}>
            <EditorContainerTop>
                <Label color={labelColor}> {name || "Label Preview"} </Label>
            </EditorContainerTop>
            <EditorContainerContent>
                <BoxContainer>
                    <Box>
                        <Text> Label name </Text>
                        <Input ref={nameEl} value={name} onChange={handlingNameChange} type="text" placeholder="Label name" width="200px" />
                    </Box>
                    <Box>
                        <Text> Description </Text>
                        <Input
                            ref={descriptionEl}
                            value={description}
                            onChange={handlingDescriptionChange}
                            type="text"
                            placeholder="Description (optional)"
                            width="600px"
                        />
                    </Box>
                    <Box>
                        <Text> Color </Text>
                        <InnerBox>
                            <ColorButton onClick={handlingColorButtonClick} color={labelColor}>
                                <Icon src={defineTextColor(labelColor) === "white" ? changeWhiteIcon : changeBlackIcon} />
                            </ColorButton>
                            <Input type="text" value={labelColor} onChange={handlingColorChange} width="70px" />
                        </InnerBox>
                    </Box>
                </BoxContainer>
                <ButtonContainer width={create ? "13.5rem" : "14.6rem"}>
                    <Button onClick={buttonClick}> Cancle </Button>
                    <Button onClick={create ? createLabel : putLabel} primary>
                        {create ? "Create label" : "Save changes"}
                    </Button>
                </ButtonContainer>
            </EditorContainerContent>
        </EditorContainer>
    );
};

export default LabelEditor;
