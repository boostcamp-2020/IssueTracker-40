import React from "react";
import styled from "styled-components";

const ListGroupSection = styled.section`
    width: 100%;
    max-width: 1280px;
    margin-top 50px;
`;

const ListGroupArea = ({ children, ...rest }) => {
    return <ListGroupSection {...rest}>{children}</ListGroupSection>;
};

export default ListGroupArea;
