import React, { useReducer, useContext } from "react";
import styled from "styled-components";
import { ListGroup, IssueItem, IssueFilterMenu } from "@components";
import { API } from "@utils";
import { usePromise } from "@hook";
import { useHistory } from "react-router-dom";
import MainContentContext from "./MainContext/MainContentContext";
import MainContext from "./MainContext/MainContext";

const ContentSection = styled.section`
    width: 100%;
    max-width: 1024px;
`;

const CONTENT_ACTION_TYPE = {
    CHANGE_TOTAL_CHECKBOX: "changeTotalCheckbox",
    INCREASE_TOTAL_CHECKBOX: "increaseTotalCheckbox",
    DECREASE_TOTAL_CHECKBOX: "decreaseTotalCheckbox",
    CHANGE_CHECKED_MENU: "changeCheckedMenu",
    CHANGE_NORMAL_MENU: "changeNormalMenu",
    CHANGE_DROPMENU: "changeDropmenu",
    HIDE_DROPMENU: "hideDropmenu"
};

const FILTER_MENUS = {
    normal: [
        { id: 1, title: "Author", isHiddenDropmenu: true, headerTitle: "Filter by Author" },
        { id: 2, title: "Label", isHiddenDropmenu: true, headerTitle: "Filter by Label" },
        { id: 3, title: "Milestones", isHiddenDropmenu: true, headerTitle: "Filter by Milestones" },
        { id: 4, title: "Assignee", isHiddenDropmenu: true, headerTitle: "Filter by Assignee" }
    ],
    checked: [{ id: 1, title: "Mark as", isHiddenDropmenu: true, headerTitle: "Actions" }]
};

const FILTER_MENU_DATAS = {
    normal: {
        authors: [
            {
                id: 1,
                name: "woojini",
                profileImage: "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg"
            },
            {
                id: 2,
                name: "Do-Ho",
                profileImage: "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg"
            }
        ],
        labels: [
            {
                id: 1,
                name: "back-end",
                description: "",
                color: "#85f97a"
            },
            {
                id: 2,
                name: "modify",
                description: "",
                color: "#4f8ec1"
            }
        ],
        milestones: [
            {
                id: 1,
                title: "Back-end"
            },
            {
                id: 2,
                title: "Front-end"
            }
        ],
        assignees: [
            {
                id: 1,
                name: "woojini",
                profileImage: "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg"
            },
            {
                id: 2,
                name: "Do-Ho",
                profileImage: "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg"
            }
        ]
    },
    checked: {
        markAs: [
            {
                id: 1,
                name: "open"
            },
            {
                id: 2,
                name: "closed"
            }
        ]
    }
};

const reducer = (contentState, action) => {
    const { issueFilterMenus } = contentState;

    let newIssueFilterMenus;
    switch (action.type) {
        case CONTENT_ACTION_TYPE.CHANGE_TOTAL_CHECKBOX:
            if (action.totalChecked > 0)
                return {
                    ...contentState,
                    totalCheckBox: action.totalChecked,
                    issueFilterMenus: FILTER_MENUS.checked,
                    issueFilterMenuDatas: FILTER_MENU_DATAS.checked
                };
            return {
                ...contentState,
                totalCheckBox: action.totalChecked,
                issueFilterMenus: FILTER_MENUS.normal,
                issueFilterMenuDatas: FILTER_MENU_DATAS.normal
            };

        case CONTENT_ACTION_TYPE.INCREASE_TOTAL_CHECKBOX:
            return {
                ...contentState,
                totalCheckBox: contentState.totalCheckBox + 1,
                issueFilterMenus: FILTER_MENUS.checked,
                issueFilterMenuDatas: FILTER_MENU_DATAS.checked
            };
        case CONTENT_ACTION_TYPE.DECREASE_TOTAL_CHECKBOX:
            if (action.totalChecked > 0)
                return {
                    ...contentState,
                    totalCheckBox: contentState.totalCheckBox - 1,
                    issueFilterMenus: FILTER_MENUS.checked,
                    issueFilterMenuDatas: FILTER_MENU_DATAS.checked
                };
            return {
                ...contentState,
                totalCheckBox: contentState.totalCheckBox - 1,
                issueFilterMenus: FILTER_MENUS.normal,
                issueFilterMenuDatas: FILTER_MENU_DATAS.normal
            };
        case CONTENT_ACTION_TYPE.CHANGE_DROPMENU:
            newIssueFilterMenus = issueFilterMenus.reduce((acc, cur) => {
                if (cur.id === Number(action.clickedMenuId) && cur.isHiddenDropmenu) return acc.concat({ ...cur, isHiddenDropmenu: false });
                return acc.concat({ ...cur, isHiddenDropmenu: true });
            }, []);
            return { ...contentState, issueFilterMenus: newIssueFilterMenus };
        case CONTENT_ACTION_TYPE.HIDE_DROPMENU:
            newIssueFilterMenus = issueFilterMenus.reduce((acc, cur) => acc.concat({ ...cur, isHiddenDropmenu: true }), []);
            return { ...contentState, issueFilterMenus: newIssueFilterMenus };
        default:
            throw new Error();
    }
};

const initialState = {
    issueFilterMenus: FILTER_MENUS.normal,
    issueFilterMenuDatas: FILTER_MENU_DATAS.normal,
    totalCheckBox: 0
};

const Content = () => {
    const [contentState, dispatch] = useReducer(reducer, initialState);
    const { issues, setIssues } = useContext(MainContext);

    const getIssueItems = () => {
        if (!issues || issues?.length === 0) return null;
        return issues.reduce(
            (acc, cur) =>
                acc.concat(
                    <ListGroup.Item key={cur.id}>
                        <IssueItem {...cur} />
                    </ListGroup.Item>
                ),
            []
        );
    };

    const getCheckedboxNodes = (issueCheckboxNodes) => {
        return [...issueCheckboxNodes].filter((issueCheckboxNode) => {
            if (issueCheckboxNode.checked) {
                return issueCheckboxNode;
            }
        });
    };

    const checkedAllcheckboxes = (issueCheckboxNodes, checked) => {
        [...issueCheckboxNodes].forEach((issueCheckboxNode) => (issueCheckboxNode.checked = checked));
    };

    const contentEventListeners = {
        onFilterDromButtonClickListener: (e) => {
            e.preventDefault();
            const evenTarget = e.target;
            const BtnNode = evenTarget.dataset.id ? evenTarget : evenTarget.parentElement;
            const issueFilterMenuId = BtnNode.dataset.id;
            dispatch({ type: CONTENT_ACTION_TYPE.CHANGE_DROPMENU, clickedMenuId: issueFilterMenuId });
        },
        onModalBackgrondClickListener: (e) => {
            e.preventDefault();
            dispatch({ type: CONTENT_ACTION_TYPE.HIDE_DROPMENU });
        },
        onChangeHeaderCheckBox: (e) => {
            const headerCheckboxNode = e.target;
            const issueCheckboxNodes = document.querySelectorAll(".issue-checkbox");
            checkedAllcheckboxes(issueCheckboxNodes, headerCheckboxNode.checked);

            const checkedNodes = getCheckedboxNodes(issueCheckboxNodes);
            dispatch({ type: CONTENT_ACTION_TYPE.CHANGE_TOTAL_CHECKBOX, totalChecked: checkedNodes.length });
        },
        onChangeIssueCheckBox: (e) => {
            const checkboxNode = e.target;
            const issueCheckboxNodes = document.querySelectorAll(".issue-checkbox");
            const checkedNodes = getCheckedboxNodes(issueCheckboxNodes);

            if (checkboxNode.checked) {
                dispatch({ type: CONTENT_ACTION_TYPE.INCREASE_TOTAL_CHECKBOX });
                return;
            }
            dispatch({ type: CONTENT_ACTION_TYPE.DECREASE_TOTAL_CHECKBOX, totalChecked: checkedNodes.length });
        },
        onMarkAsClickListener: async (e) => {
            e.stopPropagation();

            let liNode;
            switch (e.target.tagName) {
                case "LI":
                    liNode = e.target;
                    break;
                case "SPAN":
                    liNode = e.target.parentElement;
                    break;
                default:
                    break;
            }

            const issueCheckboxNodes = document.querySelectorAll(".issue-checkbox");
            const checkedboxNodes = getCheckedboxNodes(issueCheckboxNodes);

            const promises = checkedboxNodes.map((checkedboxNode) =>
                API.patchIssue({ issueId: checkedboxNode.dataset.id, state: liNode.dataset.name })
            );
            await Promise.all(promises);
            const newIssues = await API.getIssues({ page: 0 });

            setIssues(newIssues);
        }
    };

    return (
        <ContentSection>
            <MainContentContext.Provider value={{ contentState, contentEventListeners }}>
                <ListGroup.Area>
                    <ListGroup.Header>
                        <IssueFilterMenu />
                    </ListGroup.Header>
                    <ListGroup.ItemList>{getIssueItems()}</ListGroup.ItemList>
                </ListGroup.Area>
            </MainContentContext.Provider>
        </ContentSection>
    );
};

export default Content;
