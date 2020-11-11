import styled from "styled-components";
import { color } from "@style/color";

const WarningMessage = styled.div`
    display: none;
    color: ${color.form_warning_msg};
    font-size: 0.3rem;
    margin-right: auto;
    margin-left: 15%;
    margin-bottom: 0.5rem;
`;

export default WarningMessage;
