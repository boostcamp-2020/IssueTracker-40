import styled from "styled-components";
import { color } from "@style/color";

const StyledFormInput = styled.input`
    width: 70%;
    border-radius: 0.2rem;
    border: 0.1rem solid ${color.signup_box_border};
    padding: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    box-sizing: border-box;
`;

export default StyledFormInput;
