import React from "react";
import styled from "styled-components";
import { color } from "@style/color";

const ListGroupHeaderArea = styled.div`
    display: flex;
    align-items: center;
    padding: 23px;
    border: 1px solid ${color.list_group_header_border};
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: ${color.list_group_header_bg};
    & > input {
        margin-right: 17px;
    }
`;

const ListGroupHeader = ({ children, ...rest }) => {
    return <ListGroupHeaderArea {...rest}>{children}</ListGroupHeaderArea>;
};

export default ListGroupHeader;
