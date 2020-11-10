import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { UserProfile, Caret } from "@components";
import { color } from "@style/color";
import HeaderContext from "../../HeaderContext/HeaderContext";

const DropmenuContainer = styled.div`
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
`;

const DropmenuButton = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 50px;
    cursor: pointer;
`;

const DropmenuModalBackground = styled.div`
    display: ${(props) => (props.isHidden ? "none" : "block")};
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: ${color.header_dropmenu_modal_bg};
    z-index: 1000;
`;

const DropmenuList = styled.ul`
    display: ${(props) => (props.isHidden ? "none" : "block")};
    position: absolute;
    top: 100%;
    right: 15px;
    color: ${color.header_dropmenu_text};
    background-color: ${color.header_dropmenu_bg};
    border: 1px solid ${color.header_dropmenu_boader};
    border-radius: 6px;
    white-space: nowrap;
    z-index: 2000;

    &:after {
        position: absolute;
        display: inline-block;
        content: "";
        top: -14px;
        right: 10px;
        left: auto;
        border: 7px solid transparent;
        border-bottom: 7px solid ${color.header_dropmenu_bg};
    }
`;

const DropmenuMainArea = styled.li`
    padding: 8px 0px;
    border-bottom: 1px solid ${color.header_dropmenu_boader};
    &:last-of-type {
        border-bottom: none;
    }
`;

const DropmenuSubArea = styled.ul`
    & > li {
        padding: 4px 16px;
        font-size: 13px;
        cursor: pointer;
        &:hover {
            color: ${color.header_dropmenu_hover_text};
            background-color: ${color.header_dropmenu_hover_bg};
        }
    }
    ${(props) =>
        props.statusMenu &&
        css`
            & > li {
                &:hover {
                    color: ${color.header_dropmenu_text};
                    background-color: ${color.header_dropmenu_bg};
                }
            }
        `}
`;

const DropmenuSubItem = ({ children, ...rest }) => {
    return (
        <li>
            <span>{children}</span>
        </li>
    );
};

const HeaderDropmenu = () => {
    const { headerState, eventListeners } = useContext(HeaderContext);

    const getTotalMenus = () => {
        const getMenuItems = (menus) => menus.reduce((acc, cur) => acc.concat(<DropmenuSubItem key={cur.id}>{cur.title}</DropmenuSubItem>), []);

        const getMenuItemAreas = ({ userStatusMenus, navigationMenus, serviceMenus }) =>
            [userStatusMenus, navigationMenus, serviceMenus].reduce(
                (acc, cur, idx) =>
                    acc.concat(
                        <DropmenuMainArea key={idx}>
                            <DropmenuSubArea statusMenu={idx === 0}>{getMenuItems(cur)}</DropmenuSubArea>
                        </DropmenuMainArea>
                    ),
                []
            );

        return getMenuItemAreas(headerState);
    };

    return (
        <DropmenuContainer>
            <DropmenuButton type="button" onClick={eventListeners.onDropmenuClickListner}>
                <UserProfile imageUrl={headerState.userProfileImage} />
                <Caret primary />
            </DropmenuButton>
            <DropmenuModalBackground isHidden={headerState.isHiddenDropmenu} onClick={eventListeners.onModalBackgrondClickListener} />
            <DropmenuList isHidden={headerState.isHiddenDropmenu}>{getTotalMenus()}</DropmenuList>
        </DropmenuContainer>
    );
};

export default HeaderDropmenu;
