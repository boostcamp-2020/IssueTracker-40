import React from "react";
import styled from "styled-components";

const ListGroupItemLi = styled.li`
    padding: 23px;
    border-left: 1px solid #eaecef;
    border-right: 1px solid #eaecef;
    border-bottom: 1px solid #eaecef;
    background-color: #ffffff;
    &:last-of-type {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }
    &:hover {
        background-color: #f6f8fa;
    }
`;

const ListGroupItem = ({ children, ...rest }) => {
    return <ListGroupItemLi {...rest}>{children}</ListGroupItemLi>;
};

export default ListGroupItem;
