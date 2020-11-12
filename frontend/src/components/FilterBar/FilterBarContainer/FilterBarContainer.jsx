import React, { useReducer, useContext } from "react";
import FilterBarPresenter from "../FilterBarPresenter/FilterBarPresenter";
import FilterBarContext from "../FilterBarContext/FilterBarContext";

const FILTER_BAR_ACTION_TYPE = {
    SHOW_DROPMENU: "showDropmenu",
    HIDE_DROPMENU: "hideDropmenu"
};

const reducer = (filterBarState, action) => {
    switch (action.type) {
        case FILTER_BAR_ACTION_TYPE.SHOW_DROPMENU:
            return { ...filterBarState, isFilterDropHidden: false };
        case FILTER_BAR_ACTION_TYPE.HIDE_DROPMENU:
            return { ...filterBarState, isFilterDropHidden: true };
        default:
            throw new Error();
    }
};

const FilterBarContainer = () => {
    const initialState = {
        filterMenus: [
            { id: 1, title: "Open issues" },
            { id: 2, title: "Your issues" },
            { id: 3, title: "Everything assigned to you" },
            { id: 4, title: "Everything mentioning to you" },
            { id: 5, title: "Closed issues" }
        ],
        isFilterDropHidden: true
    };
    const [filterBarState, dispatch] = useReducer(reducer, initialState);

    const eventListeners = {
        onFilterDropmenuClickListener: (e) => {
            e.preventDefault();
            if (filterBarState.isFilterDropHidden) {
                dispatch({ type: FILTER_BAR_ACTION_TYPE.SHOW_DROPMENU });
                return;
            }
            dispatch({ type: FILTER_BAR_ACTION_TYPE.HIDE_DROPMENU });
        },
        onModalBackgrondClickListener: (e) => {
            e.preventDefault();
            if (!filterBarState.isHiddenDropmenu) dispatch({ type: FILTER_BAR_ACTION_TYPE.HIDE_DROPMENU });
        }
    };

    return (
        <FilterBarContext.Provider value={{ filterBarState, dispatch, eventListeners }}>
            <FilterBarPresenter />
        </FilterBarContext.Provider>
    );
};

export default FilterBarContainer;
