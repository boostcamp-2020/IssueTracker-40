import React from "react";
import styled from "styled-components";
import HeaderTitle from "./HeaderTitle/HeaderTitle";
import HeaderDropmenu from "./HeaderDropmenu/HeaderDropmenu";

const StyledHeader = styled.header`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 15px 30px;
    color: #ffffff;
    background-color: #24292e;
    box-sizing: border-box;
`;

const HeaderArea = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
`;

const HeaderPresenter = () => {
    return (
        <StyledHeader>
            <HeaderArea>
                <HeaderTitle />
                <HeaderDropmenu />
            </HeaderArea>
        </StyledHeader>
    );
};

export default HeaderPresenter;
