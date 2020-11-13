import React from "react";
import styled from "styled-components";
import { color } from "@style/color";

const Main = styled.main`
    height: 100%;
    background-color: white;
`;

const StyledDotsContainer = styled.div`
    padding: 0;
    position: absolute;
    text-align: center;
    top: 50%;
    width: 100%;

    .dots:nth-child(1) {
        animation-delay: 0.2s;
    }
    .dots:nth-child(2) {
        animation-delay: 0.4s;
    }
    .dots:nth-child(3) {
        animation-delay: 0.6s;
    }
    .dots:nth-child(4) {
        animation-delay: 0.8s;
    }
    .dots:nth-child(5) {
        animation-delay: 1s;
    }
    @keyframes bounce {
        0% {
            transform: translateY(0);
        }
        15% {
            transform: translateY(-15px);
        }
        30% {
            transform: translateY(0);
        }
    }
`;

const StyledDots = styled.div.attrs({
    className: "dots"
})`
    animation: bounce 1.5s infinite linear;
    background: ${color.loading_dots};
    border-radius: 50%;
    display: inline-block;
    height: 20px;
    text-align: center;
    width: 20px;
    margin: 0.5rem;
`;
const LoadingPage = () => {
    return (
        <Main>
            <StyledDotsContainer>
                <StyledDots />
                <StyledDots />
                <StyledDots />
                <StyledDots />
                <StyledDots />
            </StyledDotsContainer>
        </Main>
    );
};

export default LoadingPage;
