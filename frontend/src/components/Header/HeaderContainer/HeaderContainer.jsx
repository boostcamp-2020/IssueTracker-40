import React, { useReducer, useContext } from "react";
import { UserContext } from "@context";
import HeaderPresenter from "../HeaderPresenter/HeaderPresenter";
import HeaderContext from "../HeaderContext/HeaderContext";

const HEADER_ACTION_TYPE = {
    SHOW_DROPMENU: "showDropmenu",
    HIDE_DROPMENU: "hideDropmenu"
};

const reducer = (headerState, action) => {
    switch (action.type) {
        case HEADER_ACTION_TYPE.SHOW_DROPMENU:
            return { ...headerState, isHiddenDropmenu: false };
        case HEADER_ACTION_TYPE.HIDE_DROPMENU:
            return { ...headerState, isHiddenDropmenu: true };
        default:
            throw new Error();
    }
};

const HeaderContainer = () => {
    const { photoImage, name, email } = useContext(UserContext);
    const initialState = {
        userProfileImage: photoImage,
        userStatusMenus: {
            id: 1,
            menus: [
                { id: 1, title: `Signed in as ${name}` },
                { id: 2, title: `${email}` }
            ]
        },
        navigationMenus: {
            id: 2,
            menus: [
                { id: 1, title: "Your profile" },
                { id: 2, title: "Your repository" },
                { id: 3, title: "Your enterprises" },
                { id: 4, title: "Your stars" },
                { id: 5, title: "Your gists" }
            ]
        },
        serviceMenus: {
            id: 3,
            menus: [
                { id: 1, title: "Help" },
                { id: 2, title: "Sign out" }
            ]
        },
        isHiddenDropmenu: true
    };
    const [headerState, dispatch] = useReducer(reducer, initialState);

    const eventListeners = {
        onDropmenuClickListner: (e) => {
            e.preventDefault();

            if (headerState.isHiddenDropmenu) {
                dispatch({ type: HEADER_ACTION_TYPE.SHOW_DROPMENU });
                return;
            }
            dispatch({ type: HEADER_ACTION_TYPE.HIDE_DROPMENU });
        },

        onModalBackgrondClickListener: (e) => {
            e.preventDefault();
            if (!headerState.isHiddenDropmenu) dispatch({ type: HEADER_ACTION_TYPE.HIDE_DROPMENU });
        }
    };

    return (
        <HeaderContext.Provider value={{ headerState, dispatch, eventListeners }}>
            <HeaderPresenter />
        </HeaderContext.Provider>
    );
};

export default HeaderContainer;
