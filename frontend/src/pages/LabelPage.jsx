import React from "react";
import { LabelMilestoneHeader, ListGroup, LabelEditor } from "@components";

const LabelPage = () => {
    const handlingOnButtonClick = () => {
        console.log("라벨 생성 창이 생깁니다.");
    };

    return (
        <>
            <LabelMilestoneHeader value="label" buttonClick={handlingOnButtonClick} />
            <LabelEditor create />
            <LabelEditor />
            <ListGroup.Area>
                <ListGroup.Header />
                <ListGroup.ItemList />
            </ListGroup.Area>
        </>
    );
};

export default LabelPage;
