import React from "react";
import styled from "styled-components";
import { color } from "@style/color";
import HeaderTitle from "./HeaderTitle/HeaderTitle";
import HeaderDropmenu from "./HeaderDropmenu/HeaderDropmenu";

const HeaderArea = styled.header`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 15px 30px;
    background-color: ${color.header_bg};
    box-sizing: border-box;
`;

const HeaderContent = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
`;

const HeaderPresenter = () => {
    return (
        <HeaderArea>
            <HeaderContent>
                <HeaderTitle />
                <HeaderDropmenu />
            </HeaderContent>
        </HeaderArea>
    );
};

export default HeaderPresenter;
