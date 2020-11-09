import React, { useReducer } from "react";
import styled, { css } from "styled-components";
import { color } from "@style/color";

const TabMenuContainer = styled.div`
    padding-bottom: 5px;
    width: 525px;
    background-color: ${color.tab_container_gb};
`;

const TabMenuHeader = styled.div`
    display: flex;
    height: 35px;
    padding-top: 10px;
    padding-left: 10px;
    background-color: ${color.tab_bg};
    border-bottom: 1px solid ${color.tab_border};
`;

const Tab = styled.div`
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 70px;
    border-radius: 10px 10px 0px 0px;
    ${(props) =>
        props.selected &&
        css`
            background-color: ${color.tab_selected_bg};
            border-top: 1px solid ${color.tab_border};
            border-left: 1px solid ${color.tab_border};
            border-right: 1px solid ${color.tab_border};
        `}
`;

const reducer = (state, action) => {
    switch (action.type) {
        case "write_mode":
            return { isTab: true };
        case "preview_mode":
            return { isTab: false };
        default:
            throw new Error();
    }
};

const TabMenu = ({ children }) => {
    const initialState = { isTab: true };
    const [state, dispatch] = useReducer(reducer, initialState);

    const handlingOnClick = (e) => {
        const { innerText } = e.target;
        if (state.isTab && innerText === "Preview") dispatch({ type: "preview_mode" });
        else if (!state.isTab && innerText === "Write") dispatch({ type: "write_mode" });
    };

    return (
        <TabMenuContainer>
            <TabMenuHeader>
                <Tab onClick={handlingOnClick} selected={state.isTab}>
                    Write
                </Tab>
                <Tab onClick={handlingOnClick} selected={!state.isTab}>
                    Preview
                </Tab>
            </TabMenuHeader>
            {state.isTab ? children[0] : children[1]}
        </TabMenuContainer>
    );
};

export default TabMenu;
