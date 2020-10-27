import React from "react";
import styled from "styled-components";

const Main = styled.main`
    height: 100%;
    background-color: beige;
`;

const MainPage = () => {
    return (
        <Main>
            <h1>메인페이지입니다</h1>
        </Main>
    );
};

export default MainPage;
