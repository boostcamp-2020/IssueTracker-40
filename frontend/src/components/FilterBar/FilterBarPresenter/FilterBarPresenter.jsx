import React, { useContext } from "react";
import styled from "styled-components";
import SearchIcon from "@imgs/search-icon.png";
import { Caret } from "@components";
import { color } from "@style/color";
import FilterDropmenu from "../FilterDropmenu/FilterDropmenu";
import FilterBarContext from "../FilterBarContext/FilterBarContext";

const FilterForm = styled.form`
    display: flex;
    width: 65%;
`;

const FilterInputArea = styled.div`
    position: relative;
    width: 100%;
`;

const FilterBarMenuButtonArea = styled.div`
    position: relative;
`;

const FilterBarMenuButton = styled.button`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 5px 16px;
    color: ${color.filterbar_menu_btn_text};
    background-color: ${color.filterbar_menu_bg};
    border: 1px solid ${color.filterbar_menu_border};
    border-radius: 6px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    * {
        margin-right: 5px;
    }
`;

const FilterBarMenuTitle = styled.span`
    font-weight: 500;
`;

const FilterInput = styled.input`
    width: 100%;
    height: 100%;
    padding 5px 16px;
    padding-left: 32px;
    color:${color.filterbar_menu_input_text};
    background-color: ${color.filterbar_menu_input_bg};
    border: 1px solid ${color.filterbar_menu_border};
    border-radius: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: 500;
    outline: none;
`;

const SearchIconImg = styled.img.attrs({ src: SearchIcon })`
    position: absolute;
    top: 8px;
    left: 12px;
    width: 16px;
    height: 16px;
`;

const FilterBarPresenter = () => {
    const { eventListeners } = useContext(FilterBarContext);

    return (
        <FilterForm>
            <FilterBarMenuButtonArea>
                <FilterBarMenuButton type="button" onClick={eventListeners.onFilterDropmenuClickListener}>
                    <FilterBarMenuTitle>Filter</FilterBarMenuTitle>
                    <Caret />
                </FilterBarMenuButton>
                <FilterDropmenu />
            </FilterBarMenuButtonArea>
            <FilterInputArea>
                <FilterInput type="text" />
                <SearchIconImg />
            </FilterInputArea>
        </FilterForm>
    );
};

export default FilterBarPresenter;
