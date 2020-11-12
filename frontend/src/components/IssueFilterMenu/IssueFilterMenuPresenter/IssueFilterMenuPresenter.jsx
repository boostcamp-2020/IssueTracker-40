import React, { useContext } from "react";
import styled from "styled-components";
import { color } from "@style/color";
import { Checkbox, Caret } from "@components";
import IssueFilterDropmenu from "../IssueFilterDropmenu/IssueFilterDropmenu";
import MainContentContext from "../../MainTemplate/MainContext/MainContentContext";

const IssueFilterMenuArea = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const IssueFileterMenuList = styled.ul`
    display: flex;
`;

const IssueFilterItem = styled.li`
    margin-right: 16px;
    &:last-of-type {
        margin: 0;
    }
`;

const IssueDropButton = styled.button`
    position: relative;
    & > span {
        margin-right: 5px;
        color: ${color.issue_drop_btn};
    }
    &:hover > span {
        color: ${color.issue_drop_hover_btn};
    }
`;

const IssueFileterDropButton = ({ children, ...rest }) => {
    return (
        <IssueDropButton type="button" {...rest}>
            <span>{children}</span>
            <Caret />
        </IssueDropButton>
    );
};

const FilterDropmenuModalBackground = styled.div`
    display: ${(props) => (props.isHidden ? "none" : "block")};
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: ${color.issue_drop_modal_bg};
    z-index: 1000;
`;

const FilterDropmenuArea = styled.div`
    position: absolute;
    display: ${(props) => (props.isHidden ? "none" : "block")};
    z-index: 2000;
`;

const FilterCheckboxArea = styled.div`
    & > * {
        margin-right: 16px;
    }
`;

const IssueFilterMenuPresenter = () => {
    const { contentState, contentEventListeners } = useContext(MainContentContext);
    const { totalCheckBox } = contentState;

    const getIssueFilterMenus = () =>
        contentState.issueFilterMenus.reduce(
            (acc, cur) =>
                acc.concat(
                    <IssueFilterItem key={cur.id}>
                        <IssueFileterDropButton data-id={cur.id} onClick={contentEventListeners.onFilterDromButtonClickListener}>
                            {cur.title}
                        </IssueFileterDropButton>
                        <FilterDropmenuModalBackground
                            isHidden={cur.isHiddenDropmenu}
                            onClick={contentEventListeners.onModalBackgrondClickListener}
                        />
                        <FilterDropmenuArea isHidden={cur.isHiddenDropmenu}>
                            <IssueFilterDropmenu filterType={cur.title} title={cur.title} />
                        </FilterDropmenuArea>
                    </IssueFilterItem>
                ),
            []
        );

    const getTotalSelected = () => (totalCheckBox > 0 ? <span>{totalCheckBox} selected</span> : "");

    return (
        <IssueFilterMenuArea>
            <FilterCheckboxArea>
                <Checkbox type="checkbox" onChange={contentEventListeners.onChangeHeaderCheckBox} />
                {getTotalSelected()}
            </FilterCheckboxArea>
            <IssueFileterMenuList>{getIssueFilterMenus()}</IssueFileterMenuList>
        </IssueFilterMenuArea>
    );
};

export default IssueFilterMenuPresenter;
