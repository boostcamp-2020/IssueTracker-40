import React from "react";
import { LoginForm } from "@components";
import styled from "styled-components";

const Main = styled.main`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #f2f2f2;
    justify-content: center;
    place-items: center;
`;

const Title = styled.div`
    font-size: 2rem;
    margin-bottom: 3rem;
    font-weight: bold;
`;

const LoginPage = () => {
    return (
        <Main>
            <Title>이슈 트래커</Title>
            <LoginForm />
        </Main>
    );
};

export default LoginPage;
