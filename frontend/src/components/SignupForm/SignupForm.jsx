import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { debounce } from "lodash";
import { Form } from "@components";
import { API } from "@utils";

const SignupForm = () => {
    const history = useHistory();
    const idWarning = useRef();
    const passwordWarning = useRef();
    const signupWarning = useRef();
    const submitButton = useRef();
    const nameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
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

    const SubmitClick = async () => {
        try {
            await API.postSignup(emailInput.current.value, nameInput.current.value, passwordInput.current.value);
            history.push("/login");
        } catch (e) {
            signupWarning.current.style.display = "block";
        }
    };
    return (
        <Form.Container>
            <Form.Label htmlFor="name-input"> 이름 </Form.Label>
            <Form.Input ref={nameInput} type="text" id="name-input" />
            <Form.Label htmlFor="user-input"> 이메일 </Form.Label>
            <Form.Input ref={emailInput} type="text" id="user-input" onChange={debouncedInputOnChange} />
            <Form.WarningMessage ref={idWarning}>이메일은 6~26자 사이로 입력해주세요.</Form.WarningMessage>
            <Form.Label htmlFor="password-input"> 비밀번호 </Form.Label>
            <Form.Input ref={passwordInput} type="password" id="password-input" onChange={debouncedInputOnChange} />
            <Form.WarningMessage ref={passwordWarning}> 비밀번호는 6~12자 사이로 입력해주세요.</Form.WarningMessage>
            <Form.Submit ref={submitButton} onClick={SubmitClick} disabled={!(idInputFilled && passwordInputFilled)}>
                가입하기
            </Form.Submit>
            <Form.WarningMessage ref={signupWarning}> 입력 형식이 맞는지 확인해주세요. </Form.WarningMessage>
        </Form.Container>
    );
};

export default SignupForm;
