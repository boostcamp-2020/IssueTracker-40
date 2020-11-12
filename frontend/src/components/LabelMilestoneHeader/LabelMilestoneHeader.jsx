import React from "react";
import styled from "styled-components";
import { color } from "@style/color";
import { Button } from "@components";
import LabelWhiteIcon from "@imgs/label-white-icon.png";
import LabelBlackIcon from "@imgs/label-black-icon.png";
import MilestoneWhiteIcon from "@imgs/milestone-white-icon.png";
import MilestoneBlackIcon from "@imgs/milestone-black-icon.png";
import { Link } from "react-router-dom";

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1280px;
    margin-bottom: 1rem;
`;

const TabContainer = styled.div`
    display: flex;
    height: 2.3rem;
    width: 14rem;
    border-radius: 10px;
    border: 1px solid ${color.border_primary};
    cursor: pointer;
`;

const LeftTab = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 6rem;
    background-color: ${(props) => (props.value === "label" ? "#0366d6" : "white")};
    border-radius: 10px 0px 0px 10px;
    ${(props) => (props.value !== "label" ? `&:hover { background-color: ${color.primary_hover_bg} }` : "")};
`;

const RightTab = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 8rem;
    background-color: ${(props) => (props.value === "milestone" ? "#0366d6" : "white")};
    border-radius: 0px 10px 10px 0px;
    ${(props) => (props.value !== "milestone" ? `&:hover { background-color: ${color.primary_hover_bg} }` : "")};
`;

const Icon = styled.img`
    width: 1rem;
    height: 1rem;
    margin-right: 0.3rem;
`;

const LeftText = styled.p`
    color: ${(props) => (props.value === "label" ? "white" : "black")};
`;

const RightText = styled.p`
    color: ${(props) => (props.value === "milestone" ? "white" : "black")};
`;

function handlingOnClick(value) {
    if (value === "label") window.location.href = "/milestones";
    else window.location.href = "/labels";
}

const LabelMilestoneHeader = ({ value, buttonClick }) => {
    return (
        <HeaderContainer>
            <TabContainer>
                <Link to="/labels">
                    <LeftTab value={value}>
                        <Icon src={value === "label" ? LabelWhiteIcon : LabelBlackIcon} />
                        <LeftText value={value}> Labels </LeftText>
                    </LeftTab>
                </Link>
                <Link to="/milestones">
                    <RightTab value={value}>
                        <Icon src={value === "milestone" ? MilestoneWhiteIcon : MilestoneBlackIcon} />
                        <RightText value={value}> Milestones </RightText>
                    </RightTab>
                </Link>
            </TabContainer>
            <Button onClick={buttonClick} primary>
                New {value}
            </Button>
        </HeaderContainer>
    );
};

export default LabelMilestoneHeader;
