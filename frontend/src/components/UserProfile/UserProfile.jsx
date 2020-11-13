import React from "react";
import styled from "styled-components";

const StyledImg = styled.img`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    overflow: hidden;
    line-height: 1;
    vertical-align: middle;
    border-radius: 50% !important;
`;

const UserProfile = ({ imageUrl, width, height }) => {
    return <StyledImg src={imageUrl} width={width} height={height} />;
};

export default UserProfile;
