import styled from "styled-components";
import { color } from "@style/color";

const StyledFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    place-items: center;
    background-color: ${color.signup_container};
    width: 30%;
    height: 40%;
    border-radius: 0.2rem;
    border: 0.1rem; solid ${color.signup_box_border};
`;

export default StyledFormContainer;
