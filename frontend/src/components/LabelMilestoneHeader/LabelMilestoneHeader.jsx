import React from "react";
import styled, { css } from "styled-components";
import { color } from "@style/color";
import { Button } from "@components";
import LabelWhiteIcon from "@imgs/label-white-icon.png";
import LabelBlackIcon from "@imgs/label-black-icon.png";
import MilestoneWhiteIcon from "@imgs/milestone-white-icon.png";
import MilestoneBlackIcon from "@imgs/milestone-black-icon.png";

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 70%;
`

const TabContainer = styled.div`
    display: flex;
    height: 2.3rem;
    width: 14rem;
    border-radius: 10px;
    border: 1px solid ${color.border_primary};
    cursor: pointer;
`

const LeftTab = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 45%;
    background-color: ${(props) => props.value=="label"? "#0366d6": "white"};
    border-radius: 10px 0px 0px 10px;
    ${(props) => props.value!="label"? `&:hover { background-color: ${color.primary_hover_bg} }` : ""};
`

const RightTab = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 55%;
    background-color: ${(props) => props.value=="milestone"? "#0366d6": "white"};
    border-radius: 0px 10px 10px 0px;
    ${(props) => props.value!="milestone"? `&:hover { background-color: ${color.primary_hover_bg} }` : ""};
`

const Icon = styled.img`
    width: 1rem;
    height: 1rem;
    margin-right: 0.3rem;
`

const LeftText = styled.p`
    color: ${(props) => props.value=="label"? "white": "black"};
`

const RightText = styled.p`
    color: ${(props) => props.value=="milestone"? "white": "black"};
`

function handlingOnclick(value) {
    if (value=="label") location.href = "/milestones";
    else location.href = "/labels";
}

const LabelMilestoneHeader = ({value, buttonClick}) => {
    return (
        <HeaderContainer>
            <TabContainer>
                <LeftTab value={value} onClick={value=="label"? null: () => handlingOnclick(value)}>
                    <Icon src={value=="label"? LabelWhiteIcon: LabelBlackIcon} />
                    <LeftText value={value}> Labels </LeftText>
                </LeftTab>
                <RightTab value={value} onClick={value=="milestone"? null: () => handlingOnclick(value)}>
                    <Icon src={value=="milestone"? MilestoneWhiteIcon: MilestoneBlackIcon} />
                    <RightText value={value}> Milestones </RightText>
                </RightTab>
            </TabContainer>
            <Button onClick={buttonClick} primary> New {value} </Button>
        </HeaderContainer>
    );
};

export default LabelMilestoneHeader;
