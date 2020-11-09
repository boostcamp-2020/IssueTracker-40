import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { color } from "@style/color";

const HeaderLogoLink = styled(Link)`
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: 600;
`;

const HeaderLogoImg = styled.img`
    width: 32px;
    height: 32px;
    margin-right: 5px;
`;

const HeaderLogoTitle = styled.span`
    color: ${color.header_title_text};
`;

const HeaderTitle = () => {
    return (
        <HeaderLogoLink to="/">
            <HeaderLogoImg src="https://user-images.githubusercontent.com/32856129/98276858-ef6a0880-1fd9-11eb-9473-c8844c066cce.png" />
            <HeaderLogoTitle>SnailHub</HeaderLogoTitle>
        </HeaderLogoLink>
    );
};

export default HeaderTitle;
