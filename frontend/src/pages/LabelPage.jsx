import React from "react";
import { LabelMilestoneHeader } from "@components";

const LabelPage = () => {
    const handlingOnButtonClick = () => {
        console.log("라벨 생성 창이 생깁니다.");
    };

    return (
        <>
            <LabelMilestoneHeader value="label" buttonClick={handlingOnButtonClick} />
            <p> 레이블 페이지입니다</p>
        </>
    );
};

export default LabelPage;
