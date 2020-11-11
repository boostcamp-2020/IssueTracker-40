import React, { useRef, useState } from "react";
import styled from "styled-components";
import { debounce } from "lodash";
import config from "@config";
import { color } from "@style/color";
import { Form } from "@components";

const RegisterButtonContainer = styled.div`
    width: 70%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
`;

const RegisterButton = styled.button`
    border: none;
    background-color: none;
    color: ${color.register_btn};
    font-weight: bold;
    margin-left: auto;
    margin-right: auto;
`;

const GitHubLoginClick = () => {
    window.location.href = config.API.GET_GITHUB_LOGIN;
};

const SubmitClick = () => {
    alert("이벤트 발생");
};

const LoginForm = () => {
    const idWarning = useRef();
    const passwordWarning = useRef();
    const submitButton = useRef();
    const [idInputFilled, setIdInputFilled] = useState(false);
    const [passwordInputFilled, setPasswordInputFilled] = useState(false);

    const inputOnChange = (event) => {
        const inputLength = event.target.value.length;
        const targetDOM = event.target.id === "user-input" ? idWarning.current : passwordWarning.current;
        const maxLength = event.target.id === "user-input" ? 26 : 12;
        const targetState = event.target.id === "user-input" ? setIdInputFilled : setPasswordInputFilled;
        if ((inputLength > 0 && inputLength < 6) || inputLength > maxLength) {
            targetDOM.style.display = "block";
            targetState(false);
        } else if (inputLength === 0) {
            targetDOM.style.display = "none";
            targetState(false);
        } else {
            targetDOM.style.display = "none";
            targetState(true);
        }
    };

    const debouncedInputOnChange = debounce(inputOnChange, 500);

    return (
        <Form.Container>
            <Form.Label htmlFor="user-input"> 이메일 </Form.Label>
            <Form.Input type="text" id="user-input" onChange={debouncedInputOnChange} />
            <Form.WarningMessage ref={idWarning}>이메일은 6~26자 사이로 입력해주세요.</Form.WarningMessage>
            <Form.Label htmlFor="password-input"> 비밀번호 </Form.Label>
            <Form.Input type="password" id="password-input" onChange={debouncedInputOnChange} />
            <Form.WarningMessage ref={passwordWarning}> 비밀번호는 6~12자 사이로 입력해주세요.</Form.WarningMessage>
            <RegisterButtonContainer>
                <RegisterButton onClick={SubmitClick} disabled={!(idInputFilled && passwordInputFilled)}>
                    로그인
                </RegisterButton>
                <RegisterButton>회원가입</RegisterButton>
            </RegisterButtonContainer>
            <Form.Submit ref={submitButton} onClick={GitHubLoginClick}>
                Sign in with GitHub
            </Form.Submit>
        </Form.Container>
    );
};

export default LoginForm;
