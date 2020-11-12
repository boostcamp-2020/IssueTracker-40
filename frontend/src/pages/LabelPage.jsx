import React from "react";
import { Redirect } from "react-router-dom";
import { usePromise } from "@hook";
import { UserContext } from "@context";
import { Header, Main, LabelMilestoneHeader } from "@components";
import { waitAuthorizationApi } from "@utils";

const LabelPage = () => {
    const [loading, resolved, error] = usePromise(waitAuthorizationApi, []);

    if (loading) return <div>로딩중..!</div>;
    if (error) return <Redirect to="/login" />;
    if (!resolved) return null;

    const handlingOnButtonClick = () => {
        console.log('라벨 생성 창이 생깁니다.');
    }

    return (
        <UserContext.Provider value={resolved.data}>
            <Header />
            <Main>
                <LabelMilestoneHeader value="label" buttonClick={handlingOnButtonClick}/>
                <p> 레이블 페이지입니다</p>
            </Main>
        </UserContext.Provider>
    );
};

export default LabelPage;
