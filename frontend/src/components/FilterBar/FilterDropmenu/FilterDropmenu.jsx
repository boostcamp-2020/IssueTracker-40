import React, { useContext } from "react";
import styled from "styled-components";
import { ListGroup } from "@components";
import { color } from "@style/color";
import FilterBarContext from "../FilterBarContext/FilterBarContext";

const FilterDropmenuArea = styled(ListGroup.Area)`
    display: ${(props) => (props.isHidden ? "none" : "block")};
    position: absolute;
    top: 110%;
    left: 0;
    width: 250px;
    z-index: 2000;
`;

const FilterDropmenuHeader = styled(ListGroup.Header)`
    padding: 13px 18px;
    span {
        color: ${color.filterbar_dropmenu_text};
        font-size: 12px;
        font-weight: 600;
    }
`;

const FilterDropmenuItem = styled(ListGroup.Item)`
    padding: 13px 18px;

    span {
        color: ${color.filterbar_dropmenu_text};
        font-size: 12px;
        white-space: nowrap;
        cursor: pointer;
    }
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

const FilterDropmenu = () => {
    const { filterBarState, eventListeners } = useContext(FilterBarContext);

    const getFiltermenuItems = () =>
        filterBarState.filterMenus.reduce(
            (acc, cur) =>
                acc.concat(
                    <FilterDropmenuItem key={cur.id}>
                        <span onClick={eventListeners.onFilterQueryMenuClickListener} data-id={cur.id}>
                            {cur.title}
                        </span>
                    </FilterDropmenuItem>
                ),
            []
        );

    return (
        <>
            <DropmenuModalBackground isHidden={filterBarState.isFilterDropHidden} onClick={eventListeners.onModalBackgrondClickListener} />
            <FilterDropmenuArea isHidden={filterBarState.isFilterDropHidden}>
                <FilterDropmenuHeader>
                    <span>Filter Issues</span>
                </FilterDropmenuHeader>
                <ListGroup.ItemList>{getFiltermenuItems()}</ListGroup.ItemList>
            </FilterDropmenuArea>
        </>
    );
};

export default FilterDropmenu;
