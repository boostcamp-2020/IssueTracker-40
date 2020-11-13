import React, { useRef, useState } from "react";
import { LabelMilestoneHeader, Button } from "@components";
import { useHistory } from "react-router-dom";
import { API } from "@utils";
import styled from "styled-components";
import { color } from "@style/color";

const NewMilestoneContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
`;

const NewMilestoneHeader = styled.div`
    width: 100%;
`;

const NewMilestoneBody = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-top: 1px solid #e1e4e8;
    border-bottom: 1px solid #e1e4e8;
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
`;

const NewMilestoneBottom = styled.div`
    width: 100%;
`;

const NewMilestoneLabel = styled.label`
    font-weight: bold;
    margin-bottom: 0.3rem;
    font-size: 14px;
`;

const NewMilestoneInput = styled.input`
    width: 40%;
    line-height: 2;
    background-color: #fafbfc;
    border: 1px solid #e1e4e8;
    border-radius: 0.3rem;
    &:focus {
        background-color: ${color.main_bg};
        border: 1px solid ${color.title_input_focus_border};
        outline: none;
        box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075), 0 0 0 3px rgba(3, 102, 214, 0.3);
    }
    margin-bottom: 1rem;
    font-size: 15px;
`;

const NewMilestoneTextarea = styled.textarea`
    width: 70%;
    height: 200px;
    max-height: 350px;
    background-color: #fafbfc;
    border: 1px solid #e1e4e8;
    border-radius: 0.3rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const NewMilestoneTitleContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const NewMilestoneTitle = styled.div`
    font-size: 24px;
    margin-bottom: 1rem;
`;

const NewMilestoneTitleDescription = styled.div`
    color: grey;
    margin-bottom: 1rem;
`;

const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = `0${1 + date.getMonth()}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
};

const MilestoneForm = ({ isNew, ...rest }) => {
    const history = useHistory();
    const dueDateEl = useRef();
    const [title, setTitle] = useState(rest.milestone !== undefined ? rest.milestone.title : "");
    const [dueDate, setDate] = useState(rest.milestone !== undefined ? rest.milestone.dueDate : getToday());
    const [description, setDescription] = useState(rest.milestone !== undefined ? rest.milestone.description : "");

    const postMilestone = async () => {
        await API.postMilestone({ title, description, dueDate });
        window.location.href = "/milestones";
    };

    const patchMilestone = async () => {
        await API.patchMilestone(rest.milestone.id, { title, description, dueDate });
        window.location.href = "/milestones";
    };

    const closeMilestone = async () => {
        await API.patchMilestone(rest.milestone.id, { state: "closed" });
        window.location.href = "/milestones";
    };

    const handlingCancleClick = () => {
        history.push("/milestones");
    };

    const handlingTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handlingDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handlingDateChange = (e) => {
        setDate(e.target.value);
    };

    return (
        <>
            <NewMilestoneContainer>
                <NewMilestoneHeader>
                    {isNew ? (
                        <NewMilestoneTitleContainer>
                            <NewMilestoneTitle>New milestone</NewMilestoneTitle>
                            <NewMilestoneTitleDescription>
                                Create a new milestone to help organize your issues and pull requests.
                            </NewMilestoneTitleDescription>
                        </NewMilestoneTitleContainer>
                    ) : (
                        <LabelMilestoneHeader value="milestone" />
                    )}
                </NewMilestoneHeader>
                <NewMilestoneBody>
                    <NewMilestoneLabel>Title</NewMilestoneLabel>
                    <NewMilestoneInput type="text" placeholder="Title" value={title} onChange={handlingTitleChange} />
                    <NewMilestoneLabel>Due Date (optional)</NewMilestoneLabel>
                    <NewMilestoneInput ref={dueDateEl} value={dueDate} onChange={handlingDateChange} type="date" placeholder="연도. 월. 일" />
                    <NewMilestoneLabel>Description</NewMilestoneLabel>
                    <NewMilestoneTextarea value={description} onChange={handlingDescriptionChange} />
                </NewMilestoneBody>
                <NewMilestoneBottom>
                    {isNew ? (
                        <ButtonContainer>
                            <Button onClick={postMilestone} primary>
                                Create milestone
                            </Button>
                        </ButtonContainer>
                    ) : (
                        <ButtonContainer>
                            <Button onClick={handlingCancleClick}>Cancel</Button>
                            <Button onClick={closeMilestone}>Close milestone</Button>
                            <Button onClick={patchMilestone} primary>
                                Save changes
                            </Button>
                        </ButtonContainer>
                    )}
                </NewMilestoneBottom>
            </NewMilestoneContainer>
        </>
    );
};

export default MilestoneForm;
