import React, { useContext } from "react";
import styled from "styled-components";
import { Checkbox, Caret } from "@components";
import IssueFilterMenuContext from "../IssueFilterMenuContext/IssueFilterMenuContext";
import IssueFilterDropmenu from "../IssueFilterDropmenu/IssueFilterDropmenu";

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
        color: #6a737d;
    }
    &:hover > span {
        color: #444d56;
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
    background-color: transparent;
    z-index: 1000;
`;

const FilterDropmenuArea = styled.div`
    position: absolute;
    display: ${(props) => (props.isHidden ? "none" : "block")};
    z-index: 2000;
`;

const IssueFilterMenuPresenter = () => {
    const { issueFilterMenuState, eventListeners } = useContext(IssueFilterMenuContext);

    const getIssueFilterMenus = () =>
        issueFilterMenuState.issueFilterMenus.reduce(
            (acc, cur) =>
                acc.concat(
                    <IssueFilterItem key={cur.id}>
                        <IssueFileterDropButton data-id={cur.id} onClick={eventListeners.onFilterDromButtonClickListener}>
                            {cur.title}
                        </IssueFileterDropButton>
                        <FilterDropmenuModalBackground isHidden={cur.isHiddenDropmenu} onClick={eventListeners.onModalBackgrondClickListener} />
                        <FilterDropmenuArea isHidden={cur.isHiddenDropmenu}>
                            <IssueFilterDropmenu filterType={cur.title} title={cur.title} />
                        </FilterDropmenuArea>
                    </IssueFilterItem>
                ),
            []
        );

    return (
        <IssueFilterMenuArea>
            <Checkbox type="checkbox" />
            <IssueFileterMenuList>{getIssueFilterMenus()}</IssueFileterMenuList>
        </IssueFilterMenuArea>
    );
};

export default IssueFilterMenuPresenter;
