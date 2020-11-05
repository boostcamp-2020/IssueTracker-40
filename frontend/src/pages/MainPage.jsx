import React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { usePromise } from "@hook";
import axios from "axios";
import { UserContext } from "@context";
import Config from "@config";

const Main = styled.main`
    height: 100%;
    background-color: beige;
`;

const waitAuthorizationApi = async () => {
    const userInfo = await axios.get(Config.API.GET_AUTH, { withCredentials: true });
    return userInfo;
};

const MainPage = () => {
    const [loading, resolved, error] = usePromise(waitAuthorizationApi, []);

    if (loading) return <div>로딩중..!</div>;
    if (error) return <Redirect to="/login" />;
    if (!resolved) return null;

    return (
        <UserContext.Provider value={resolved.data}>
            <Main>
                <h1>메인페이지입니다</h1>
            </Main>
        </UserContext.Provider>
    );
};

export default MainPage;
