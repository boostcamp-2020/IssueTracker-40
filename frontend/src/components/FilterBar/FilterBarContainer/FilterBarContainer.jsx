import React, { useReducer, useContext } from "react";
import { API } from "@utils";
import { UserContext } from "@context";
import FilterBarPresenter from "../FilterBarPresenter/FilterBarPresenter";
import FilterBarContext from "../FilterBarContext/FilterBarContext";
import MainContext from "../../MainTemplate/MainContext/MainContext";

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
    const { name } = useContext(UserContext);
    const { setIssues } = useContext(MainContext);
    const initialState = {
        filterMenus: [
            { id: 1, title: "Open issues", query: "is:open" },
            { id: 2, title: "Your issues", query: `author:${name}` },
            { id: 3, title: "Everything assigned to you", query: `assignee:${name}` },
            { id: 4, title: "Everything mentioning to you" },
            { id: 5, title: "Closed issues", query: `is:closed` }
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
        },
        onFilterQueryMenuClickListener: async (e) => {
            const spanNode = e.target;
            const { id } = spanNode.dataset;
            const { filterMenus } = filterBarState;
            const issues = await API.getIssues({ page: 0, q: filterMenus[parseInt(id, 10) - 1].query });
            setIssues(issues);
            dispatch({ type: FILTER_BAR_ACTION_TYPE.HIDE_DROPMENU });
        }
    };

    return (
        <FilterBarContext.Provider value={{ filterBarState, dispatch, eventListeners }}>
            <FilterBarPresenter />
        </FilterBarContext.Provider>
    );
};

export default FilterBarContainer;
