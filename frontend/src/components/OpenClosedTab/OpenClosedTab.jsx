import React from "react";
import styled from "styled-components";
import MilestoneGrayIcon from "@imgs/milestone-gray-icon.png";
import MilestoneBlackIcon from "@imgs/milestone-black-icon.png";
import CheckBlackIcon from "@imgs/check-black-icon.png";
import CheckGrayIcon from "@imgs/check-gray-icon.png";

const OpenClosedTabView = styled.div`
    display: flex;
`;

const Tab = styled.div`
    display: flex;
    margin-right: 1rem;
    &:hover {
        cursor: pointer;
    }
`;

const Icon = styled.img`
    width: 1rem;
    height: 1rem;
`;

const Text = styled.p`
    margin-left: 0.6rem;
    font-weight: bold;
    color: ${(props) => (props.status === "open" ? "black" : "grey")};
`;

const OpenClosedTab = ({ open, close, status, setStatus }) => {
    return (
        <OpenClosedTabView>
            <Tab onClick={() => setStatus("open")}>
                <Icon src={status === "open" ? MilestoneBlackIcon : MilestoneGrayIcon} />
                <Text status={status}> {open || 0} Open</Text>
            </Tab>
            <Tab onClick={() => setStatus("closed")}>
                <Icon src={status === "open" ? CheckGrayIcon : CheckBlackIcon} />
                <Text status={status === "open" ? "closed" : "open"}> {close || 0} Closed</Text>
            </Tab>
        </OpenClosedTabView>
    );
};

export default OpenClosedTab;
