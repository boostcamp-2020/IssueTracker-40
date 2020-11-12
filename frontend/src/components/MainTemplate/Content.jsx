import React from "react";
import styled from "styled-components";

const ContentSection = styled.section`
    width: 100%;
    max-width: 1280px;
`;

const Top = ({ children, ...rest }) => {
    return <ContentSection {...rest}> {children} </ContentSection>;
};

export default Top;
