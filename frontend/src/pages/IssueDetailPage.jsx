import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { usePromise } from "@hook";
import { UserContext } from "@context";
import { Header } from "@components";
import { waitAuthorizationApi } from "@utils";

const Main = styled.main`
    height: 100%;
    background-color: beige;
`;

const IssueDetailPage = ({ match }) => {
    const [loading, resolved, error] = usePromise(waitAuthorizationApi, []);
    const { params } = match;
    if (loading) return <div>로딩중..!</div>;
    if (error) return <Redirect to="/login" />;
    if (!resolved) return null;

    return (
        <UserContext.Provider value={resolved.data}>
            <Header />
            <Main>
                <p>이슈 상세페이지입니다</p>
                {params.id}
            </Main>
        </UserContext.Provider>
    );
};

export default IssueDetailPage;
