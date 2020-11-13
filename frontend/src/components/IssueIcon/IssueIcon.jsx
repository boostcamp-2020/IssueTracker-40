import React from "react";
import issueOpenIcon from "@imgs/issue-open-icon.png";
import issueClosedIcon from "@imgs/issue-closed-icon.png";
import styled from "styled-components";

const IssueIconImg = styled.img`
    width: 16px;
    height: 16px;
`;

const IssueIcon = ({ ...rest }) => {
    const { open, close } = rest;

    return <IssueIconImg {...rest} src={open ? issueOpenIcon : issueClosedIcon} alt="이슈아이콘" />;
};

export default IssueIcon;
