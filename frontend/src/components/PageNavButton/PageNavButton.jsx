import React, { useState } from "react";
import styled from "styled-components";
import MilestoneIcon from "@imgs/milestone-black-icon.png";
import Labelcon from "@imgs/label-black-icon.png";
import { NavLink } from "react-router-dom";
import { color } from "@style/color";

const PageNavButtonArea = styled.div`
    display: flex;
    & > a:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: none;
    }
    & > a:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
`;

const NavigationLinkButton = styled(NavLink)`
    display: flex;
    align-items: center;
    padding: 5px 16px;
    border-top: 1px solid #e1e4e8;
    border-bottom: 1px solid #e1e4e8;
    border-right: 1px solid #e1e4e8;
    border-left: 1px solid #e1e4e8;
    border-radius: 6px;
    background-color: ${color.page_nav_btn_bg};
    color: ${color.page_nav_btn_text};
    font-weight: 500;

    &:hover {
        background-color: ${color.page_nav_btn_hover_bg};
    }

    * {
        margin-right: 5px;
    }
`;

const LabelIconImg = styled.img.attrs({ src: Labelcon })`
    width: 16px;
    height: 16px;
`;

const MilestoneIconImg = styled.img.attrs({ src: MilestoneIcon })`
    width: 16px;
    height: 16px;
`;

const NavigationButton = ({ children, ...rest }) => {
    const { icon } = rest;

    const getNavButtonIconImg = () => (icon === "label" ? <LabelIconImg /> : <MilestoneIconImg />);

    return (
        <NavigationLinkButton {...rest}>
            {getNavButtonIconImg()}
            <span>{children}</span>
        </NavigationLinkButton>
    );
};

const PageNavButton = () => {
    const [navButtonState, setNavButtonState] = useState([
        {
            id: 1,
            value: "Label",
            icon: "label",
            to: "/labels"
        },
        {
            id: 2,
            value: "Milestones",
            icon: "milestone",
            to: "/milestones"
        }
    ]);

    const getNavigationButtons = () =>
        navButtonState.reduce(
            (acc, cur) =>
                acc.concat(
                    <NavigationButton key={cur.id} type="button" icon={cur.icon} to={cur.to}>
                        {cur.value}
                    </NavigationButton>
                ),
            []
        );

    return <PageNavButtonArea>{getNavigationButtons()}</PageNavButtonArea>;
};

export default PageNavButton;
