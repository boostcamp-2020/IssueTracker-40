import React from "react";
import { Route, Switch } from "react-router-dom";
import { MainPage, LoginPage, IssueDetailPage, LabelPage, MilestonePage, NewIssuePage, NewMilestonePage, SignupPage } from "@pages";
import { waitAuthorizationApi } from "@utils";
import { Header, Main } from "@components";
import { UserContext } from "@context";
import { usePromise } from "@hook";

const waitAuthorization = () => {
    if (window.location.pathname !== "/login") {
        return usePromise(waitAuthorizationApi, []);
    }
    return [null, null, null];
};

const App = () => {
    const [loading, resolved, error] = waitAuthorization();

    if (window.location.pathname !== "/login") {
        if (loading) return <LoadingPage />;
        if (error) window.location.href = "/login";
        if (!resolved) return null;
    }

    return (
        <>
            <UserContext.Provider value={resolved !== null ? resolved.data : {}}>
                <Route exact path="/login" component={LoginPage} />
                <Header />
                <Main>
                    <Route exact path="/" component={MainPage} />
                    <Switch>
                        <Route exact path="/signup" component={SignupPage} />
                        <Route exact path="/new" component={NewIssuePage} />
                        <Route exact path="/issue/:issueId" component={IssueDetailPage} />
                        <Route exact path="/milestones" component={MilestonePage} />
                        <Route exact path="/milestones/new" component={NewMilestonePage} />
                        <Route exact path="/labels" component={LabelPage} />
                    </Switch>
                </Main>
            </UserContext.Provider>
        </>
    );
};

export default App;
