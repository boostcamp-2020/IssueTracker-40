import React from "react";
import styled from "styled-components";

const ListGroupSection = styled.section`
    width: 100%;
    & ul {
        margin: 0;
        padding: 0;
        li {
            list-style: none;
        }
    }
`;

const ListGroupArea = ({ children, ...rest }) => {
    return <ListGroupSection {...rest}>{children}</ListGroupSection>;
};

export default ListGroupArea;
