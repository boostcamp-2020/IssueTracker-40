import React from "react";
import { Redirect } from "react-router-dom";
import { usePromise } from "@hook";
import { UserContext } from "@context";
import { Header, Main, LabelMilestoneHeader, ListGroup, LabelEditor } from "@components";
import { waitAuthorizationApi } from "@utils";

const LabelPage = () => {
    const [loading, resolved, error] = usePromise(waitAuthorizationApi, []);

    if (loading) return <div>로딩중..!</div>;
    if (error) return <Redirect to="/login" />;
    if (!resolved) return null;

    const handlingOnButtonClick = () => {
        console.log("라벨 생성 창이 생깁니다.");
    };

    return (
        <UserContext.Provider value={resolved.data}>
            <Header />
            <Main>
                <LabelMilestoneHeader value="label" buttonClick={handlingOnButtonClick} />
                <LabelEditor create />
                <LabelEditor />
                <ListGroup.Area>
                    <ListGroup.Header />
                    <ListGroup.ItemList />
                </ListGroup.Area>
            </Main>
        </UserContext.Provider>
    );
};

export default LabelPage;
