import React from "react";
import { Redirect } from "react-router-dom";
import { usePromise } from "@hook";
import { UserContext } from "@context";
import { Header, Main } from "@components";
import { waitAuthorizationApi } from "@utils";

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
                <p> {params.issueId}번 이슈 상세페이지입니다</p>
            </Main>
        </UserContext.Provider>
    );
};

export default IssueDetailPage;
