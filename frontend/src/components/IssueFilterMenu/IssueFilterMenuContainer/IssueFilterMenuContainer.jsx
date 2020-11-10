import React, { useReducer } from "react";
import IssueFilterMenuContext from "../IssueFilterMenuContext/IssueFilterMenuContext";
import IssueFilterMenuPresenter from "../IssueFilterMenuPresenter/IssueFilterMenuPresenter";

const ISSUE_FILTER_ACTION_TYPE = {
    CHANGE_DROPMENU: "changeDropmenu",
    HIDE_DROPMENU: "hideDropmenu"
};

const reducer = (issueFilterMenuState, action) => {
    const { issueFilterMenus } = issueFilterMenuState;

    let newIssueFilterMenus;
    switch (action.type) {
        case ISSUE_FILTER_ACTION_TYPE.CHANGE_DROPMENU:
            newIssueFilterMenus = issueFilterMenus.reduce((acc, cur) => {
                if (cur.id === Number(action.clickedMenuId) && cur.isHiddenDropmenu) return acc.concat({ ...cur, isHiddenDropmenu: false });
                return acc.concat({ ...cur, isHiddenDropmenu: true });
            }, []);
            break;
        case ISSUE_FILTER_ACTION_TYPE.HIDE_DROPMENU:
            newIssueFilterMenus = issueFilterMenus.reduce((acc, cur) => acc.concat({ ...cur, isHiddenDropmenu: true }), []);
            break;
        default:
            throw new Error();
    }
    return { ...issueFilterMenuState, issueFilterMenus: newIssueFilterMenus };
};

const IssueFilterMenuContainer = () => {
    const initialState = {
        issueFilterMenus: [
            { id: 1, title: "Author", isHiddenDropmenu: true },
            { id: 2, title: "Label", isHiddenDropmenu: true },
            { id: 3, title: "Milestones", isHiddenDropmenu: true },
            { id: 4, title: "Assignee", isHiddenDropmenu: true }
        ],
        athors: [
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
    };
    const [issueFilterMenuState, dispatch] = useReducer(reducer, initialState);

    const eventListeners = {
        onFilterDromButtonClickListener: (e) => {
            e.preventDefault();
            const evenTarget = e.target;
            const BtnNode = evenTarget.dataset.id ? evenTarget : evenTarget.parentElement;
            const issueFilterMenuId = BtnNode.dataset.id;

            dispatch({ type: ISSUE_FILTER_ACTION_TYPE.CHANGE_DROPMENU, clickedMenuId: issueFilterMenuId });
        },
        onModalBackgrondClickListener: (e) => {
            e.preventDefault();
            dispatch({ type: ISSUE_FILTER_ACTION_TYPE.HIDE_DROPMENU });
        }
    };

    return (
        <IssueFilterMenuContext.Provider value={{ issueFilterMenuState, dispatch, eventListeners }}>
            <IssueFilterMenuPresenter />
        </IssueFilterMenuContext.Provider>
    );
};

export default IssueFilterMenuContainer;
