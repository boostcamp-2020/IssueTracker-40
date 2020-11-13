import React, { useState } from "react";
import { LabelMilestoneHeader, ListGroup, OpenClosedTab, MilestoneItem } from "@components";
import styled from "styled-components";
import { API } from "@utils";
import { usePromise } from "@hook";
import { useHistory } from "react-router-dom";
import { LoadingPage } from "@pages";

const MilestoneView = styled.div`
    width: 100%;
    max-width: 1280px;
`;

const MilestonePage = () => {
    const [status, setStatus] = useState("open");
    const history = useHistory();

    const handlingNewMilestoneButtonClick = () => {
        history.push("/milestones/new");
    };

    const getMilestones = async () => {
        const milestones = await API.getMilestones();
        return milestones;
    };

    const [loading, resolved, error] = usePromise(getMilestones, []);

    if (loading) return <LoadingPage />;
    if (error) window.location.href = "/";
    if (!resolved) return null;

    const { milestones, openMilestoneCount, closeMilestoneCount } = resolved.data;

    const getMilestoneItems = () =>
        milestones.reduce(
            (acc, cur) =>
                cur.state === status
                    ? acc.concat(
                          <ListGroup.Item key={cur.id}>
                              <MilestoneItem {...cur} />
                          </ListGroup.Item>
                      )
                    : acc.concat(null),
            []
        );

    return (
        <MilestoneView>
            <LabelMilestoneHeader value="milestone" buttonClick={handlingNewMilestoneButtonClick} />
            <ListGroup.Area>
                <ListGroup.Header>
                    <OpenClosedTab open={openMilestoneCount} close={closeMilestoneCount} status={status} setStatus={setStatus} />
                </ListGroup.Header>
                <ListGroup.ItemList>{getMilestoneItems()}</ListGroup.ItemList>
            </ListGroup.Area>
        </MilestoneView>
    );
};

export default MilestonePage;
