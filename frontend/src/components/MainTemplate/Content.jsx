import React, { useReducer } from "react";
import styled from "styled-components";
import { ListGroup, IssueItem, IssueFilterMenu } from "@components";
import MainContentContext from "./MainContext/MainContentContext";

const ContentSection = styled.section`
    width: 100%;
    max-width: 1024px;
`;

const issues = [
    {
        id: 1,
        title: "로그인 기능 구현",
        labels: [
            {
                id: 1,
                name: "back-end",
                color: "#85f97a"
            },
            {
                id: 2,
                name: "modify",
                color: "#4f8ec1"
            }
        ],
        milestone: {
            id: 1,
            title: "Back-end"
        },
        assignees: [
            {
                id: 1,
                name: "crong",
                profileImage: "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg"
            }
        ],
        author: {
            id: 1,
            name: "jinhyukoo"
        },
        createdAt: "2020-10-09T08:11:57.136Z"
    },
    {
        id: 2,
        title: "로그인 폼 컴포넌트 제작",
        labels: [
            {
                id: 3,
                name: "front-end",
                color: "#ed6d71"
            }
        ],
        milestone: {
            id: 2,
            title: "Front-end"
        },
        assignees: [
            {
                id: 1,
                name: "crong",
                profileImage: "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg"
            },
            {
                id: 2,
                name: "crong2",
                profileImage: "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg"
            },
            {
                id: 3,
                name: "crong2",
                profileImage: "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg"
            },
            {
                id: 4,
                name: "crong2",
                profileImage: "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg"
            }
        ],
        author: {
            id: 2,
            name: "wooojini"
        },
        createdAt: "2020-11-09T18:01:34.136Z"
    }
];

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

    const getIssueItems = () =>
        issues.reduce(
            (acc, cur) =>
                acc.concat(
                    <ListGroup.Item key={cur.id}>
                        <IssueItem {...cur} />
                    </ListGroup.Item>
                ),
            []
        );

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
