import React from "react";
import { Redirect, NavLink } from "react-router-dom";
import { usePromise } from "@hook";
import { UserContext } from "@context";
import { Header, Main, MainTemplate, FilterBar, PageNavButton, Button } from "@components";
import { API } from "@utils";
import { LoadingPage } from "@pages";

const MainPage = () => {
    const [issueLoading, issueResolved, issueError] = usePromise(API.getIssues, [], { page: 0 });

    if (issueLoading) return <LoadingPage />;
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
