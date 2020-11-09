import React from "react";
import styled from "styled-components";

const StyledImg = styled.img`
    width: 20px;
    height: 20px;
    overflow: hidden;
    line-height: 1;
    vertical-align: middle;
    border-radius: 50% !important;
`;

const UserProfile = ({ imageUrl }) => {
    return <StyledImg src={imageUrl} />;
};

export default UserProfile;
