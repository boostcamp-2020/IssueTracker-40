import React, { useContext } from "react";
import { ListGroup, UserProfile } from "@components";
import styled from "styled-components";
import MainContentContext from "../../MainTemplate/MainContext/MainContentContext";

const FILTER_TYPE = {
    AUTHOR: "Author",
    LABEL: "Label",
    MILESTONES: "Milestones",
    ASSIGNEE: "Assignee",
    MARK_AS: "Mark as"
};

const FilterItemArea = styled.div`
    display: flex;
    cursor: pointer;
    & > * {
        margin-right: 5px;
    }
`;

const IssueFilterDropmenuHeader = styled(ListGroup.Header)`
    padding: 13px 18px;
`;

const IssueFilterDropmenuItem = styled(ListGroup.Item)`
    padding: 13px 18px;
    & span {
        cursor: pointer;
    }
`;

const ProfileItemArea = styled(FilterItemArea)`
    align-items: center;
`;

const ProfileItem = ({ id, name, profileImage }) => {
    return (
        <IssueFilterDropmenuItem>
            <ProfileItemArea>
                <UserProfile imageUrl={profileImage} width="20px" height="20px" />
                <span>{name}</span>
            </ProfileItemArea>
        </IssueFilterDropmenuItem>
    );
};

const LabelColor = styled.span`
    width: 13px;
    height: 13px;
    border-radius: 3px;
    background-color: ${(props) => props.color};
`;

const LabelInfoArea = styled.div`
    display: flex;
    flex-direction: column;
`;

const LabelDescription = styled.span`
    font-size: 12px;
`;

const LabelItem = ({ id, name, description, color }) => {
    return (
        <IssueFilterDropmenuItem>
            <FilterItemArea>
                <LabelColor color={color}> </LabelColor>
                <LabelInfoArea>
                    <span>{name}</span>
                    {description !== "" ? <LabelDescription>{description}</LabelDescription> : ""}
                </LabelInfoArea>
            </FilterItemArea>
        </IssueFilterDropmenuItem>
    );
};

const MilestoneItem = ({ id, title }) => {
    return (
        <IssueFilterDropmenuItem>
            <FilterItemArea>
                <span>{title}</span>
            </FilterItemArea>
        </IssueFilterDropmenuItem>
    );
};

const MarkAsItem = ({ id, name }) => {
    return (
        <IssueFilterDropmenuItem>
            <span>{name}</span>
        </IssueFilterDropmenuItem>
    );
};

const IssueFilterDropmenu = ({ filterType, title }) => {
    const { contentState } = useContext(MainContentContext);

    const getDropmenuHeader = () => {
        return <span>{title === "Mark as" ? "Actions" : `Filter by ${title}`}</span>;
    };

    const getDropmenuItems = () => {
        const { authors, labels, milestones, assignees, markAs } = contentState.issueFilterMenuDatas;

        switch (filterType) {
            case FILTER_TYPE.AUTHOR:
                return authors.reduce((acc, cur) => acc.concat(<ProfileItem key={cur.id} name={cur.name} profileImage={cur.profileImage} />), []);
            case FILTER_TYPE.LABEL:
                return labels.reduce(
                    (acc, cur) => acc.concat(<LabelItem key={cur.id} name={cur.name} description={cur.description} color={cur.color} />),
                    []
                );
            case FILTER_TYPE.MILESTONES:
                return milestones.reduce((acc, cur) => acc.concat(<MilestoneItem key={cur.id} title={cur.title} />), []);
            case FILTER_TYPE.ASSIGNEE:
                return assignees.reduce((acc, cur) => acc.concat(<ProfileItem key={cur.id} name={cur.name} profileImage={cur.profileImage} />), []);
            case FILTER_TYPE.MARK_AS:
                return markAs.reduce((acc, cur) => acc.concat(<MarkAsItem key={cur.id} name={cur.name} />), []);
            default:
                return <></>;
        }
    };

    return (
        <ListGroup.Area>
            <IssueFilterDropmenuHeader>{getDropmenuHeader()}</IssueFilterDropmenuHeader>
            <ListGroup.ItemList>{getDropmenuItems()}</ListGroup.ItemList>
        </ListGroup.Area>
    );
};

export default IssueFilterDropmenu;
