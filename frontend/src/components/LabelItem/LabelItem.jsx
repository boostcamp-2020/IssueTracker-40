import React, { useState } from "react";
import styled from "styled-components";
import { Label, LabelEditor } from "@components";
import { color } from "@style/color";
import { API } from "@utils";

const LabelItemContainer = styled.div`
    display: flex;
    width: 100%;
`;

const LabelItemBox = styled.div`
    width: ${(props) => props.width};
`;

const LabelItemButton = styled.button`
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    background-color: initial;
    border: 0;
    &:hover {
        color: ${color.text_link};
        text-decoration: underline;
    }
`;

const Wrap = styled.div`
    display: ${(props) => (props.show ? "flex" : "none")};
    width: 100%;
`;

const EditWrap = styled.div`
    display: ${(props) => (props.show ? "flex" : "none")};
`;

const LabelItem = ({ ...rest }) => {
    const deleteLabel = async () => {
        await API.deleteLabel(rest.id);
        window.location.reload();
    };
    const [isEdit, setEditMode] = useState(true);

    const handlingEditMode = () => {
        setEditMode(!isEdit);
    };

    return (
        <LabelItemContainer>
            <Wrap show={isEdit}>
                <LabelItemBox width="20%">
                    <Label color={rest.color}> {rest.name} </Label>
                </LabelItemBox>
                <LabelItemBox width="70%"> {rest.description} </LabelItemBox>
                <LabelItemBox width="10%">
                    <LabelItemButton onClick={handlingEditMode}> Edit </LabelItemButton>
                    <LabelItemButton onClick={deleteLabel}> Delete </LabelItemButton>
                </LabelItemBox>
            </Wrap>
            <EditWrap show={!isEdit}>
                <LabelEditor buttonClick={handlingEditMode} {...rest} />
            </EditWrap>
        </LabelItemContainer>
    );
};

export default LabelItem;
