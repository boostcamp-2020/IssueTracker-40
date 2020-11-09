import React from "react";
import styled from "styled-components";

const ListGroupHeaderArea = styled.div`
    display: flex;
    align-items: center;
    padding: 23px;
    border: 1px solid #eaecef;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: #f6f8fa;
    & > input {
        margin-right: 17px;
    }
`;

const ListGroupHeader = ({ children, ...rest }) => {
    return <ListGroupHeaderArea {...rest}>{children}</ListGroupHeaderArea>;
};

export default ListGroupHeader;
