import React from "react";
import styled from "styled-components";
import calendarBlackIcon from "@imgs/calendar-black-icon.png";
import { ProgressBar } from "@components";
import { API } from "@utils";
import { Link } from "react-router-dom";

const MilestoneItemView = styled.div`
    display: flex;
    justify-content: space-between;
`;

const MilestoneItemBox = styled.div`
    display: flex;
    flex-direction: column;
`;

const MilestoneProgressBox = styled.div`
    display: flex;
    margin-bottom: 0.5rem;
`;

const MilestoneCountBox = styled.div`
    display: flex;
`;

const MilestoneCountNumber = styled.div`
    font-weight: bold;
    margin-right: 0.2rem;
`;

const MilestoneCountString = styled.div`
    color: grey;
    margin-right: 0.8rem;
`;

const MilstoneMethodBox = styled.div`
    display: flex;
`;

const MilestoneTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const MilestoneDueDateBox = styled.div`
    display: flex;
`;

const Icon = styled.img`
    width: 1rem;
    height: 1rem;
`;

const MilestoneDueDate = styled.div`
    margin-left: 0.5rem;
    color: grey;
`;

const MilestoneDescription = styled.div`
    color: grey;
`;

const Method = styled.p`
    margin-right: 1rem;
    color: ${(props) => (props.danger ? "red" : "blue")};
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const MilestoneItem = ({ ...rest }) => {
    const stateButtonClick = async () => {
        await API.patchMilestone(rest.id, { state: rest.state === "open" ? "closed" : "open" });
        window.location.reload();
    };
    const deleteButtonClick = async () => {
        await API.deleteMilestone(rest.id);
        window.location.reload();
    };
    return (
        <MilestoneItemView>
            <MilestoneItemBox>
                <MilestoneTitle>{rest.title}</MilestoneTitle>
                <MilestoneDueDateBox>
                    <Icon src={calendarBlackIcon} />
                    <MilestoneDueDate>{rest.dueDate}</MilestoneDueDate>
                </MilestoneDueDateBox>
                <MilestoneDescription>{rest.description}</MilestoneDescription>
            </MilestoneItemBox>
            <MilestoneItemBox>
                <MilestoneProgressBox>
                    <ProgressBar value={rest.openIssueCount} max={rest.openIssueCount + rest.closedIssueCount} />
                </MilestoneProgressBox>
                <MilestoneProgressBox>
                    <MilestoneCountBox>
                        <MilestoneCountNumber>
                            {parseInt(rest.openIssueCount, 10) / (parseInt(rest.openIssueCount, 10) + parseInt(rest.closedIssueCount, 10)) || 0}%
                        </MilestoneCountNumber>
                        <MilestoneCountString>complete</MilestoneCountString>
                        <MilestoneCountNumber>{rest.openIssueCount || 0}</MilestoneCountNumber>
                        <MilestoneCountString>open</MilestoneCountString>
                        <MilestoneCountNumber>{rest.closeIssueCount || 0}</MilestoneCountNumber>
                        <MilestoneCountString>closed</MilestoneCountString>
                    </MilestoneCountBox>
                </MilestoneProgressBox>
                <MilstoneMethodBox>
                    <Link to={`milestones/${rest.id}/edit`}>
                        <Method>Edit</Method>
                    </Link>
                    <Method onClick={stateButtonClick}>{rest.state === "open" ? "Close" : "Open"}</Method>
                    <Method onClick={deleteButtonClick} danger>
                        Delete
                    </Method>
                </MilstoneMethodBox>
            </MilestoneItemBox>
        </MilestoneItemView>
    );
};

export default MilestoneItem;
