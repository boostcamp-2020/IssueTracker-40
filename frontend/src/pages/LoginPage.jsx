import React from "react";
import styled from "styled-components";
import { LoginForm } from "@components";

const Main = styled.main`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #f2f2f2;
    justify-content: center;
    place-items: center;
`;

const LoginTitle = styled.div`
    font-size: 2rem;
    margin-bottom: 3rem;
    font-weight: bold;
`;

const LoginPage = () => {
    return (
        <Main>
            <LoginTitle>이슈 트래커</LoginTitle>
            <LoginForm />
        </Main>
    );
};

export default LoginPage;
