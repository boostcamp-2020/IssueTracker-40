import React, { useState } from "react";
import { LabelMilestoneHeader, LabelEditor, ListGroup, LabelItem } from "@components";
import { API } from "@utils";
import { usePromise } from "@hook";
import styled from "styled-components";

const LabelView = styled.div`
    width: 100%;
    max-width: 1280px;
`;

const LabelPage = () => {
    const [isOpenNewLabel, setOpenNewLabel] = useState(false);
    const handlingOnButtonClick = () => {
        setOpenNewLabel(!isOpenNewLabel);
    };

    const getLabels = async () => {
        const labels = await API.getLabels();
        return labels;
    };

    const [loading, resolved, error] = usePromise(getLabels, []);

    if (loading) return <div>로딩중..!</div>;
    if (error) window.location.href = "/";
    if (!resolved) return null;

    const labels = resolved.data.lables;

    const getLabelItems = () =>
        labels.reduce(
            (acc, cur) =>
                acc.concat(
                    <ListGroup.Item key={cur.id}>
                        <LabelItem {...cur} />
                    </ListGroup.Item>
                ),
            []
        );

    return (
        <LabelView>
            <LabelMilestoneHeader value="label" buttonClick={handlingOnButtonClick} />
            {isOpenNewLabel ? <LabelEditor buttonClick={handlingOnButtonClick} create /> : null}
            <ListGroup.Area>
                <ListGroup.Header>
                    <p>
                        <b> {labels.length} labels </b>
                    </p>
                </ListGroup.Header>
                <ListGroup.ItemList>{getLabelItems()}</ListGroup.ItemList>
            </ListGroup.Area>
        </LabelView>
    );
};

export default LabelPage;
