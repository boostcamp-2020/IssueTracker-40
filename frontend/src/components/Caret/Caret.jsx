import styled from "styled-components";
import { color } from "@style/color";

const Caret = styled.span`
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: middle;
    content: "";
    border-top-style: solid;
    border-top-width: 4px;
    border-right: 4px solid transparent;
    border-bottom: 0 solid transparent;
    border-left: 4px solid transparent;
    color: ${color.caret_text};
`;

export default Caret;
