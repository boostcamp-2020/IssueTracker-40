import React from "react";
import { LoginForm } from "@components";
import styled from "styled-components";

const Main = styled.main`
    height: 100%;
    background-color: moccasin;
`;

const LoginPage = () => {
    return (
        <Main>
            <h1>로그인페이지입니다!!</h1>
            <LoginForm />
        </Main>
    );
};

export default LoginPage;
