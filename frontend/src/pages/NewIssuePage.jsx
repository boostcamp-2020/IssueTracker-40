import React, { useContext } from "react";
import { UserContext } from "@context";
import { ContentEditor, SidebarMenu, Button, UserProfile } from "@components";
import styled from "styled-components";
import { color } from "@style/color";
import { API } from "@utils";
import { usePromise } from "@hook";
import { useHistory } from "react-router-dom";

const StyledNewIssueContainer = styled.form`
    display: flex;
    justify-content: center;
    align-items: space-between;
`;

const StyledLeftContainer = styled.div`
    margin-top: 3rem;
`;

const CenterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
    margin-left: 1rem;
    margin-right: 1rem;
    border: 1px solid ${color.container_border};
    border-radius: 0.5rem;
    padding: 0.5rem;
`;

const CenterButtonContainer = styled.div`
    width: 95%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.5rem;
`;

const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
`;

const TitleInput = styled.input`
    width: 95%;
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

const LeftContainer = () => {
    const { photoImage } = useContext(UserContext);
    return (
        <StyledLeftContainer>
            <UserProfile imageUrl={photoImage} width="40px" height="40px" />
        </StyledLeftContainer>
    );
};

const NewIssuePage = () => {
    const history = useHistory();

    const onSubmitListener = async (e) => {
        e.preventDefault();
        const formNode = e.target;
        const { title, content } = formNode;

        try {
            await API.postIssue({ title: title.value, content: content.value });
            history.push({ pathname: "/" });
        } catch (err) {
            alert("이슈를 생성하는데 문제가 발생했습니다!");
        }
    };

    return (
        <>
            <StyledNewIssueContainer onSubmit={onSubmitListener}>
                <LeftContainer />
                <CenterContainer>
                    <TitleInput name="title" placeholder="Title" />
                    <ContentEditor />
                    <CenterButtonContainer>
                        <Button>Cancle</Button>
                        <Button primary>Submit new issue</Button>
                    </CenterButtonContainer>
                </CenterContainer>
                <RightContainer>
                    <SidebarMenu title="Assignees" />
                    <SidebarMenu title="Labels" />
                    <SidebarMenu title="Milestone" />
                </RightContainer>
            </StyledNewIssueContainer>
        </>
    );
};

export default NewIssuePage;
