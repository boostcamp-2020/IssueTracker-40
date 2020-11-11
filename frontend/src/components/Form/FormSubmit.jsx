import styled from "styled-components";
import { color } from "@style/color";

const StyledSubmitButton = styled.button`
    width: 70%;
    border-radius: 0.2rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    border: 0.1rem solid ${color.signup_box_border};
    color: ${color.signup_submit_text};
    font-weight: bold;
    box-sizing: border-box;
    background-color: ${(props) => (props.disabled ? color.signup_submit_disabled : color.signup_submit)};
`;

export default StyledSubmitButton;
