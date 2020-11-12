import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { MainPage, LoginPage, IssueDetailPage, LabelPage, MilestonePage, NewIssuePage, NewMilestonePage, SignupPage } from "@pages";

const App = () => {
    return (
        <>
            <Route exact path="/" component={MainPage} />
            <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/new" component={NewIssuePage} />
                <Route path="/issue/:issueId" component={IssueDetailPage} />
                <Route path="/milestones" component={MilestonePage} />
                <Route path="/milestones/new" component={NewMilestonePage} />
                <Route path="/labels" component={LabelPage} />
                <Redirect from="*" to="/" />
            </Switch>
        </>
    );
};

export default App;
