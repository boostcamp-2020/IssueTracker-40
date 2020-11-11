import React from "react";
import styled from "styled-components";
import { SignupForm } from "@components";
import { color } from "@style/color";

const Main = styled.main`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: ${color.signup_page_bg};
    justify-content: center;
    place-items: center;
`;

const SignupTitle = styled.div`
    font-size: 2rem;
    margin-bottom: 3rem;
    font-weight: bold;
`;

const SignupPage = () => {
    return (
        <Main>
            <SignupTitle>회원 가입</SignupTitle>
            <SignupForm />
        </Main>
    );
};

export default SignupPage;
