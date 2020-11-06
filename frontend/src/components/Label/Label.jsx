import React from "react";
import styled from "styled-components";

const StyledLabel = styled.button`
    background-color: ${(props) => props.color};
    border-radius: 1rem;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    line-height: 20px;
    padding: 5px 16px;
    border: none;
    &:hover {
        text-decoration: underline;
    }
`;

const Label = ({ children, ...rest }) => {
    return <StyledLabel {...rest}> {children} </StyledLabel>;
};

export default Label;