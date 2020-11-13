import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { usePromise } from "@hook";
import { MainTemplate, FilterBar, PageNavButton, Button } from "@components";
import { API } from "@utils";
import MainContext from "../components/MainTemplate/MainContext/MainContext";

const MainPage = () => {
    const [loading, resolved, error] = usePromise(API.getIssues, [], { page: 0 });
    const [issues, setIssues] = useState(resolved);

    useEffect(async () => {
        setIssues(resolved);
    }, [resolved]);

    if (loading) return <div>로딩중..!</div>;
    if (error) window.location.href = "/login";

    return (
        <MainContext.Provider value={{ issues, setIssues }}>
            <MainTemplate.Top>
                <FilterBar />
                <PageNavButton />
                <Button primary>
                    <NavLink to="/new">New Issue</NavLink>
                </Button>
            </MainTemplate.Top>
            <MainTemplate.Content />
        </MainContext.Provider>
    );
};

export default MainPage;
