import React from "react";
import styled from "styled-components";

const TopSection = styled.section`
    display: flex;
    width: 100%;
    max-width: 1024px;
    justify-content: space-between;
    margin-bottom: 15px;
`;

const Top = ({ children, ...rest }) => {
    return <TopSection {...rest}> {children} </TopSection>;
};

export default Top;
