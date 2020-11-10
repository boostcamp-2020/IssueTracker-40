import React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { usePromise } from "@hook";
import axios from "axios";
import { UserContext } from "@context";
import Config from "@config";
import { Header, ListGroup, IssueItem, IssueFilterMenu } from "@components";

const Main = styled.main`
    height: 100%;
`;

const waitAuthorizationApi = async () => {
    const userInfo = await axios.get(Config.API.GET_AUTH, { withCredentials: true });
    return userInfo;
};

const MainPage = () => {
    const [loading, resolved, error] = usePromise(waitAuthorizationApi, []);

    if (loading) return <div>로딩중..!</div>;
    if (error) return <Redirect to="/login" />;
    if (!resolved) return null;

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

    return (
        <UserContext.Provider value={resolved.data}>
            <Header />
            <Main>
                <ListGroup.Area>
                    <ListGroup.Header>
                        <IssueFilterMenu />
                    </ListGroup.Header>
                    <ListGroup.ItemList>{getIssueItems()}</ListGroup.ItemList>
                </ListGroup.Area>
            </Main>
        </UserContext.Provider>
    );
};

export default MainPage;
