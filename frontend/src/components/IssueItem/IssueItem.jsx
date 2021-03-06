import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { color } from "@style/color";
import { Checkbox, IssueIcon, Label, UserProfile } from "@components";
import milestoneIcon from "@imgs/milestone-gray-icon.png";
import MainContentContext from "../MainTemplate/MainContext/MainContentContext";

const IssueItemArea = styled.div`
    display: flex;
    align-items: flex-start;
    & > input {
        margin-right: 17px;
    }
`;

const IssueItemInfoArea = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const IssueItemInfo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    &:last-of-type {
        margin: 0;
    }
    & > * {
        margin-right: 5px;
    }
`;

const IssueTitle = styled.span`
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    &:hover {
        color: ${color.issue_item_title};
    }
`;

const IssueDetailInfo = styled.span`
    color: ${color.issue_item_detail_info_text};
`;

const IssueMilestoneTagArea = styled.div`
    display: flex;
    align-items: center;
`;

const IssueMilestoneImg = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 5px;
`;

const IssueMilestoneTitle = styled.span`
    color: ${color.issue_item_milestone_title};
`;

const IssueMilestoneTag = ({ children }) => {
    return (
        <IssueMilestoneTagArea>
            <IssueMilestoneImg src={milestoneIcon} />
            <IssueMilestoneTitle>{children}</IssueMilestoneTitle>
        </IssueMilestoneTagArea>
    );
};

const IssueLabelList = styled.ul`
    display: flex;
    & > li {
        margin-right: 5px;
    }
`;

const IssueAssigneeList = styled.ul`
    position: relative;
    ${(props) =>
        Array(props.totalAssignees)
            .fill(0)
            .reduce(
                (acc, cur, idx) =>
                    (acc += `&:hover > li:nth-child(${idx + 1}) {
                        transform: translateX(${-20 * idx}px);
            }`),
                ""
            )}
`;

const AssigneeListItem = styled.li`
    position: absolute;
    right: 0;
    transition: transform 0.1s ease-in;
    transform: translateX(${(props) => props.idx * -8}px);
    z-index: ${(props) => props.totalAssignees - props.idx};
    cursor: pointer;
`;

const IssueItem = ({ id, title, labels, milestone, assignees, author, state, createdAt }) => {
    const history = useHistory();
    const { contentEventListeners } = useContext(MainContentContext);

    const getLabels = () =>
        labels.reduce(
            (acc, cur) =>
                acc.concat(
                    <li key={cur.id}>
                        <Label color={cur.color}>{cur.name}</Label>
                    </li>
                ),
            []
        );

    const getAssignees = () =>
        assignees.reduce(
            (acc, cur, idx, arr) =>
                acc.concat(
                    <AssigneeListItem key={cur.id} idx={idx} totalAssignees={arr.length}>
                        <UserProfile imageUrl={cur.profileImage} width="20px" height="20px" />
                    </AssigneeListItem>
                ),
            []
        );

    const getIssueDetailInfo = () => {
        const getCreationTime = () => {
            const nowDate = new Date(new Date().toUTCString());
            const createDate = new Date(createdAt);

            const elapsedMSec = nowDate - createDate;
            if (elapsedMSec < 1000) return "now";

            const elapsedSec = elapsedMSec / 1000;
            if (elapsedSec < 60) return `${Math.floor(elapsedSec)} seconds ago`;

            const elapsedMin = elapsedSec / 60;
            if (elapsedMin < 60) return `${Math.floor(elapsedMin)} minute ago`;

            const elapsedHour = elapsedMin / 60;
            if (elapsedHour < 24) return `${Math.floor(elapsedHour)} hours ago`;

            const elapsedDay = elapsedHour / 24;
            if (elapsedDay < 30) return `${Math.floor(elapsedDay)} days ago`;

            const removePattern = /\s[0-9:]+ [GMT+0-9]+ [ㄱ-ㅎ가-힣(\s)]+/;
            return `${createDate.toString().replace(removePattern, "")}`;
        };
        return `#${id} ${state === "open" ? `${state}ed` : state} ${getCreationTime()} by ${author.name}`;
    };

    const onClickIssueTitle = (e) => {
        history.push({ pathname: `/issue/${id}` });
    };

    return (
        <IssueItemArea>
            <Checkbox className="issue-checkbox" data-id={id} onChange={contentEventListeners.onChangeIssueCheckBox} />
            <IssueItemInfoArea>
                <div>
                    <IssueItemInfo>
                        <IssueIcon open />
                        <IssueTitle onClick={onClickIssueTitle}>{title}</IssueTitle>
                        <IssueLabelList>{getLabels()}</IssueLabelList>
                    </IssueItemInfo>
                    <IssueItemInfo>
                        <IssueDetailInfo>{getIssueDetailInfo()}</IssueDetailInfo>
                        <IssueMilestoneTag>{milestone.title}</IssueMilestoneTag>
                    </IssueItemInfo>
                </div>
                <IssueAssigneeList totalAssignees={assignees.length}>{getAssignees()}</IssueAssigneeList>
            </IssueItemInfoArea>
        </IssueItemArea>
    );
};

export default IssueItem;
