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
        userStatusMenus: [`Signed in as ${name}`, `${email}`],
        navigationMenus: ["Your profile", "Your repository", "Your enterprises", "Your projects", "Your stars", "Your gists"],
        serviceMenus: ["Help", "Sign out"],
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
