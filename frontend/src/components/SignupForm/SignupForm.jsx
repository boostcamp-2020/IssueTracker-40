import React, { useRef, useState } from "react";
import styled from "styled-components";
import { debounce } from "lodash";
import { color } from "@style/color";

const SignupFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    place-items: center;
    background-color: white;
    width: 30%;
    height: 40%;
    border-radius: 0.2rem;
    border: 0.1rem; solid ${color.signup_box_border};
`;
const SignupFormLabel = styled.label`
    margin-right: auto;
    margin-left: 15%;
    font-weight: bold;
`;
const SignupFormInput = styled.input`
    width: 70%;
    border-radius: 0.2rem;
    border: 0.1rem solid ${color.signup_box_border};
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    box-sizing: border-box;
`;

const SignupSubmitButton = styled.button`
    width: 70%;
    border-radius: 0.2rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    border: 0.1rem solid ${color.signup_box_border};
    color: white;
    font-weight: bold;
    box-sizing: border-box;
    background-color: ${(props) => (props.disabled ? color.signup_submit_disabled : color.signup_submit)};
`;

const WarningMessage = styled.div`
    display: none;
    color: red;
    font-size: 0.3rem;
    margin-right: auto;
    margin-left: 15%;
    margin-bottom: 0.5rem;
`;

const SubmitClick = () => {
    alert("이벤트 발생");
};

const SignupForm = () => {
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
        <SignupFormContainer>
            <SignupFormLabel htmlFor="user-input"> 이름 </SignupFormLabel>
            <SignupFormInput type="text" id="user-input" />
            <SignupFormLabel htmlFor="user-input"> 이메일 </SignupFormLabel>
            <SignupFormInput type="text" id="user-input" onChange={debouncedInputOnChange} />
            <WarningMessage ref={idWarning}>이메일은 6~26자 사이로 입력해주세요.</WarningMessage>
            <SignupFormLabel htmlFor="user-input"> 비밀번호 </SignupFormLabel>
            <SignupFormInput type="password" id="password-input" onChange={debouncedInputOnChange} />
            <WarningMessage ref={passwordWarning}>비밀번호는 6~12자 사이로 입력해주세요.</WarningMessage>
            <SignupSubmitButton ref={submitButton} onClick={SubmitClick} disabled={!(idInputFilled && passwordInputFilled)}>
                가입하기
            </SignupSubmitButton>
        </SignupFormContainer>
    );
};

export default SignupForm;
