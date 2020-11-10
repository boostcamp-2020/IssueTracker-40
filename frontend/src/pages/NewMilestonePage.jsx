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

const NewMilestonePage = () => {
    const [loading, resolved, error] = usePromise(waitAuthorizationApi, []);

    if (loading) return <div>로딩중..!</div>;
    if (error) return <Redirect to="/login" />;
    if (!resolved) return null;

    return (
        <UserContext.Provider value={resolved.data}>
            <Header />
            <Main>
                <p>마일스톤 생성 페이지입니다</p>
            </Main>
        </UserContext.Provider>
    );
};

export default NewMilestonePage;
