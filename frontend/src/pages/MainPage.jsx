import React from "react";
import { Redirect, NavLink } from "react-router-dom";
import { usePromise } from "@hook";
import { UserContext } from "@context";

import { Header, Main, MainTemplate, FilterBar, PageNavButton, Button } from "@components";
import { waitAuthorizationApi, API } from "@utils";

const MainPage = () => {
    const [loading, resolved, error] = usePromise(waitAuthorizationApi, []);
    const [issueLoading, issueResolved, issueError] = usePromise(API.getIssues, [], { page: 0 });

    if (loading) return <div>로딩중..!</div>;
    if (error) return <Redirect to="/login" />;
    if (!resolved) return null;

    if (issueLoading) return <div>로딩중..!</div>;
    if (issueError) return <Redirect to="/" />;
    if (!issueResolved) return null;

    return (
        <UserContext.Provider value={resolved.data}>
            <Header />
            <Main>
                <MainTemplate.Top>
                    <FilterBar />
                    <PageNavButton />
                    <Button primary>
                        <NavLink to="/new">New Issue</NavLink>
                    </Button>
                </MainTemplate.Top>
                <MainTemplate.Content />
            </Main>
        </UserContext.Provider>
    );
};

export default MainPage;
