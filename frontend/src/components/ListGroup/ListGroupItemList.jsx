import React from "react";
import styled from "styled-components";
import { color } from "@style/color";

const ListGroupItemUl = styled.ul`
    height: 100%;
    max-height: ${(props) => (props.isEmpty ? "328px" : "none")};
    border-right: ${(props) => (props.isEmpty ? `1px solid ${color.list_group_border}` : "none")};
    border-left: ${(props) => (props.isEmpty ? `1px solid ${color.list_group_border}` : "none")};
    border-bottom: ${(props) => (props.isEmpty ? `1px solid ${color.list_group_border}` : "none")};
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
`;

const ListGroupItemList = ({ children, ...rest }) => {
    return (
        <ListGroupItemUl {...rest} isEmpty={!children}>
            {children}
        </ListGroupItemUl>
    );
};

export default ListGroupItemList;
