import React, { useRef } from "react";
import styled from "styled-components";
import { debounce } from "lodash";

const LoginFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    place-items: center;
    background-color: white;
    width: 30%;
    height: 40%;
    border-radius: 0.2rem;
    border: 0.1rem; solid #E6E6E6;
`;
const LoginFormLabel = styled.label`
    margin-right: auto;
    margin-left: 15%;
    font-weight: bold;
`;
const LoginFormInput = styled.input`
    width: 70%;
    border-radius: 0.2rem;
    border: 0.1rem solid #e6e6e6;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    box-sizing: border-box;
`;

const GitHubLoginButton = styled.button`
    width: 70%;
    border-radius: 0.2rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    border: 0.1rem solid #e6e6e6;
    background-color: #a4a4a4;
    color: white;
    font-weight: bold;
    box-sizing: border-box;
`;

const WarningMessage = styled.div`
    display: none;
    color: red;
    font-size: 0.3rem;
    margin-right: auto;
    margin-left: 15%;
`;

const LoginForm = () => {
    const idWarning = useRef();
    const passwordWarning = useRef();

    const inputOnChange = (event) => {
        const inputLength = event.target.value.length;
        const targetDOM = event.target.id === "user-input" ? idWarning.current : passwordWarning.current;
        const maxLength = event.target.id === "user-input" ? 16 : 12;
        if ((inputLength > 0 && inputLength < 6) || inputLength > maxLength) {
            targetDOM.style.display = "block";
        } else {
            targetDOM.style.display = "none";
        }
    };
    const debouncedInputOnChange = debounce(inputOnChange, 500);

    return (
        <LoginFormContainer>
            <LoginFormLabel htmlFor="user-input"> 아이디 </LoginFormLabel>
            <WarningMessage ref={idWarning}>아이디는 6~16자 사이로 입력해주세요.</WarningMessage>
            <LoginFormInput type="text" name="username" id="user-input" onChange={debouncedInputOnChange} />
            <LoginFormLabel htmlFor="user-input"> 비밀번호 </LoginFormLabel>
            <WarningMessage ref={passwordWarning}>비밀번호는 6~12자 사이로 입력해주세요.</WarningMessage>
            <LoginFormInput type="password" name="username" id="password-input" onChange={debouncedInputOnChange} />
            <GitHubLoginButton>Sign in with GitHub</GitHubLoginButton>
        </LoginFormContainer>
    );
};

export default LoginForm;
