import React from "react";
import styled from "styled-components";
import { color } from "@style/color";

const MainContainer = styled.main`
    display: flex;
    flex-direction: column;
    justfy-content: center;
    align-items: center;
    min-height: 100%;
    margin-top: 20px;
    background-color: ${color.main_bg};
`;

const Main = ({ children, ...rest }) => {
    return <MainContainer {...rest}> {children} </MainContainer>;
};

export default Main;
