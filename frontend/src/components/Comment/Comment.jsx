import React from "react";
import styled from "styled-components";
import { Remarkable } from "remarkable";
import { color } from "@style/color";
import { Button } from "@components";

const PreviewContainer = styled.div`
    width: 100%;
    word-break: break-all;
    height: auto;
    padding: 0.5rem;
    background-color: white;
    font-size: auto;
    border: 1px solid ${color.border_primary};
    margin-bottom: 1rem;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
`;

const PreviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    width: 100%;
    border-left: 1px solid ${color.border_primary};
    border-right: 1px solid ${color.border_primary};
    border-top: 1px solid ${color.border_primary};
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    background-color: ${color.tab_bg};
`;

const HeaderAuthorContainer = styled.div`
    display: flex;
    line-height: 1.8;
`;

const HeaderMenuContainer = styled.div`
    display: flex;
`;

const AuthorBox = styled.div`
    font-weight: bold;
    margin-right: 0.2rem;
`;

const View = styled.div`
    padding: 0px;
`;

const MenuButton = styled.div`
    border: 1px solid ${color.border_primary};
    border-radius: 1rem;
    padding: 0.2rem;
    line-height: 1;
    margin-left: 0.1rem;
    margin-right: 0.1rem;
`;

const Comment = ({ author, text }) => {
    const md = new Remarkable();
    const getRawMarkup = () => {
        return {
            __html: md.render(text)
        };
    };
    return (
        <>
            <PreviewHeader>
                <HeaderAuthorContainer>
                    <AuthorBox>{author}</AuthorBox>
                    <div>left a comment</div>
                </HeaderAuthorContainer>
                <HeaderMenuContainer>
                    <MenuButton>Member</MenuButton>
                    <MenuButton>Edit</MenuButton>
                </HeaderMenuContainer>
            </PreviewHeader>
            <PreviewContainer>
                {text === "" ? "Nothing to preview" : ""}
                <View dangerouslySetInnerHTML={getRawMarkup()} />
            </PreviewContainer>
        </>
    );
};

export default Comment;
