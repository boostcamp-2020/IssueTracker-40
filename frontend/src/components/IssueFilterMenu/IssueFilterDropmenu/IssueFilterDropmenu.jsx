import React, { useContext } from "react";
import { ListGroup, UserProfile } from "@components";
import styled from "styled-components";
import IssueFilterMenuContext from "../IssueFilterMenuContext/IssueFilterMenuContext";

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
`;

const ProfileItemArea = styled(FilterItemArea)`
    align-items: center;
`;

const ProfileItem = ({ id, name, profileImage }) => {
    return (
        <IssueFilterDropmenuItem>
            <ProfileItemArea>
                <UserProfile imageUrl={profileImage} />
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

const IssueFilterDropmenu = ({ filterType, title }) => {
    const { issueFilterMenuState } = useContext(IssueFilterMenuContext);

    const getDropmenuItems = () => {
        const { athors, labels, milestones, assignees } = issueFilterMenuState;

        switch (filterType) {
            case FILTER_TYPE.AUTHOR:
                return athors.reduce((acc, cur) => acc.concat(<ProfileItem key={cur.id} name={cur.name} profileImage={cur.profileImage} />), []);
            case FILTER_TYPE.LABEL:
                return labels.reduce(
                    (acc, cur) => acc.concat(<LabelItem key={cur.id} name={cur.name} description={cur.description} color={cur.color} />),
                    []
                );
            case FILTER_TYPE.MILESTONES:
                return milestones.reduce((acc, cur) => acc.concat(<MilestoneItem key={cur.id} title={cur.title} />), []);
            case FILTER_TYPE.ASSIGNEE:
                return assignees.reduce((acc, cur) => acc.concat(<ProfileItem key={cur.id} name={cur.name} profileImage={cur.profileImage} />), []);
            default:
                return <></>;
        }
    };

    return (
        <ListGroup.Area>
            <IssueFilterDropmenuHeader>
                <span>Filter by {title}</span>
            </IssueFilterDropmenuHeader>
            <ListGroup.ItemList>{getDropmenuItems()}</ListGroup.ItemList>
        </ListGroup.Area>
    );
};

export default IssueFilterDropmenu;
