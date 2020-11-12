import React from "react";
import { Redirect } from "react-router-dom";
import { usePromise } from "@hook";
import { UserContext } from "@context";
import { Header, Main, LabelMilestoneHeader } from "@components";
import { waitAuthorizationApi } from "@utils";

const MilestonePage = () => {
    const [loading, resolved, error] = usePromise(waitAuthorizationApi, []);

    if (loading) return <div>로딩중..!</div>;
    if (error) return <Redirect to="/login" />;
    if (!resolved) return null;

    return (
        <UserContext.Provider value={resolved.data}>
            <Header />
            <Main>
                <LabelMilestoneHeader value="milestone"/>
                <p>마일스톤 페이지입니다</p>
            </Main>
        </UserContext.Provider>
    );
};

export default MilestonePage;
