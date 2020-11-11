import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { usePromise } from "@hook";
import { UserContext } from "@context";
import { Header, Main, ContentEditor, SidebarMenu, Button, UserProfile } from "@components";
import { waitAuthorizationApi } from "@utils";
import { LoadingPage } from "@pages";
import styled from "styled-components";
import { color } from "@style/color";

const StyledNewIssueContainer = styled.div`
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
    const [loading, resolved, error] = usePromise(waitAuthorizationApi, []);

    if (loading)
        return (
            <div>
                <LoadingPage />
            </div>
        );
    if (error) return <Redirect to="/login" />;
    if (!resolved) return null;

    return (
        <UserContext.Provider value={resolved.data}>
            <Header />
            <Main>
                <StyledNewIssueContainer>
                    <LeftContainer />
                    <CenterContainer>
                        <TitleInput placeholder="Title" />
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
            </Main>
        </UserContext.Provider>
    );
};

export default NewIssuePage;
