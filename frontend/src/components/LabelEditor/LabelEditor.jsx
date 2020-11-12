import React, { useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
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
    border: 1px solid ${color.tertiary_border};
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
    background-color: #0e8a16;
    border-radius: 10px;
    margin-right: 0.5rem;
`;

const Icon = styled.img`
    width: 1rem;
    height: 1rem;
`;

const LabelEditor = ({ create }) => {
    const nameEl = useRef();
    const descriptionEl = useRef();
    const [labelColor, setLabelColor] = useState("#0e8a16");

    const labelbg = "#0e8a16"; // useState로 수정가능하도록 구현

    const createLabel = async () => {
        await API.postLabel({ name: nameEl.current.value, description: descriptionEl.current.value, color: labelColor });
    };

    const handlingColorChange = (e) => {
        setLabelColor(e.target.value);
    };

    return (
        <EditorContainer create={create}>
            <EditorContainerTop>
                <Label color={labelbg}> Label Preview </Label>
            </EditorContainerTop>
            <EditorContainerContent>
                <BoxContainer>
                    <Box>
                        <Text> Label name </Text>
                        <Input ref={nameEl} type="text" placeholder="Label name" width="200px" />
                    </Box>
                    <Box>
                        <Text> Description </Text>
                        <Input ref={descriptionEl} type="text" placeholder="Description (optional)" width="600px" />
                    </Box>
                    <Box>
                        <Text> Color </Text>
                        <InnerBox>
                            <ColorButton>
                                <Icon src={changeWhiteIcon} />
                            </ColorButton>
                            <Input type="text" value={labelColor} onChange={handlingColorChange} width="70px" />
                        </InnerBox>
                    </Box>
                </BoxContainer>
                <ButtonContainer width={create ? "13.5rem" : "14.6rem"}>
                    <Button> Cancle </Button>
                    <Button onClick={createLabel} primary>
                        {create ? "Create label" : "Save changes"}
                    </Button>
                </ButtonContainer>
            </EditorContainerContent>
        </EditorContainer>
    );
};

export default LabelEditor;
