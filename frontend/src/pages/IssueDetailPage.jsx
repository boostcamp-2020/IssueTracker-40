import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { usePromise } from "@hook";
import { UserContext } from "@context";
import { IssueDetail, Button, ContentEditor, SidebarMenu, UserProfile, Comment, ProgressBar, Label } from "@components";
import { waitAuthorizationApi, API } from "@utils";
import styled from "styled-components";
import { color } from "@style/color";

const StyledTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;
const StyledTitleBox = styled.div`
    display: flex;
`;
const StyledTitle = styled.div`
    font-size: 20px;
`;
const StyledTitleNumber = styled.div`
    font-size: 20px;
    color: grey;
`;

const StyledContentContainer = styled.div`
    display: flex;
    width: 100%;
`;

const CommentWrapper = styled.div`
    width: 95%;
    margin-left: 1rem;
`;

const EditorWrapper = styled.div`
    width: 100%;
    margin-left: 1rem;
    border: 1px solid ${color.border_primary};
    border-radius: 0.5rem;
    padding: 0.5rem;
`;

const ButtonWrapper = styled.div`
    width: 98%;
    display: flex;
    justify-content: flex-end;
`;

const AssigneeItems = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 0.8rem;
`;
const AssigneeItem = styled.div`
    margin: 0.3em;
`;
const LabelItems = styled.div`
    display: flex;
    flex-direction: row;
`;
const MilestoneItem = styled.div`
    display: flex;
    flex-direction: column;
`;

const ContentViewerContainer = ({ comments }) => {
    return comments.map((comment) => (
        <StyledContentContainer>
            <UserProfile imageUrl={comment?.user?.profileImage} width="40px" height="40px" />
            <CommentWrapper>
                <Comment author={comment?.user?.name} text={comment?.content} />
            </CommentWrapper>
        </StyledContentContainer>
    ));
};

const ContentEditorContainer = () => {
    const { photoImage } = useContext(UserContext);
    return (
        <>
            <StyledContentContainer>
                <UserProfile imageUrl={photoImage} width="40px" height="40px" />
                <EditorWrapper>
                    <ContentEditor />
                    <ButtonWrapper>
                        <Button>Close issue</Button>
                        <Button primary>Comment</Button>
                    </ButtonWrapper>
                </EditorWrapper>
            </StyledContentContainer>
        </>
    );
};

const IssueDetailPage = ({ match }) => {
    const { issueId } = match.params;
    const [issueLoading, issueResolved, issueError] = usePromise(API.getIssueById, [], issueId);

    if (issueLoading) return <div>로딩중..!</div>;
    if (issueError) return <Redirect to="/" />;
    if (!issueResolved) return null;

    const assignees = issueResolved?.assignees;
    const assigneeItems = (
        <AssigneeItems>
            {assignees?.map((assignee) => (
                <AssigneeItem>
                    <UserProfile imageUrl={assignee?.profileImage} width="20px" height="20px" />
                    {assignee?.name}
                </AssigneeItem>
            ))}
        </AssigneeItems>
    );

    const labels = issueResolved?.labels;
    const labelItems = (
        <LabelItems>
            {labels?.map((label) => (
                <Label color={label?.color}>{label?.name}</Label>
            ))}
        </LabelItems>
    );

    const milestone = issueResolved?.milestone;
    const milestoneItem = (
        <div>
            <ProgressBar value={milestone?.closedIssueCount} max={milestone?.openIssueCount + milestone?.closedIssueCount} />{" "}
            <MilestoneItem>{milestone?.title}</MilestoneItem>
        </div>
    );

    const comments = issueResolved?.comments;

    return (
        <>
            <IssueDetail.Top>
                <StyledTitleContainer>
                    <StyledTitleBox>
                        <StyledTitle>{issueResolved?.title}</StyledTitle>
                        <StyledTitleNumber>#{issueResolved?.id}</StyledTitleNumber>
                    </StyledTitleBox>
                    <Button>Edit</Button>
                </StyledTitleContainer>
            </IssueDetail.Top>
            <IssueDetail.Middle>
                <IssueDetail.MiddleLeft>
                    <ContentViewerContainer comments={comments} />
                    <ContentEditorContainer />
                </IssueDetail.MiddleLeft>
                <IssueDetail.MiddleRight>
                    <SidebarMenu title="Assignees">{assigneeItems}</SidebarMenu>
                    <SidebarMenu title="Labels">{labelItems}</SidebarMenu>
                    <SidebarMenu title="Milestone">{milestoneItem}</SidebarMenu>
                </IssueDetail.MiddleRight>
            </IssueDetail.Middle>
        </>
    );
};

export default IssueDetailPage;
