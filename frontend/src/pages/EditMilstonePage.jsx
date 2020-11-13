import React from "react";
import { MilestoneForm } from "@components";
import { usePromise } from "@hook";
import { API } from "@utils";
import { LoadingPage } from "@pages";

const EditMilestonePage = ({ match }) => {
    const { milestoneId } = match.params;

    const getMilestone = async () => {
        const milestone = await API.getMilestone(milestoneId);
        return milestone;
    };

    const [loading, resolved, error] = usePromise(getMilestone, []);

    if (loading) return <LoadingPage />;
    if (error) window.location.href = "/";
    if (!resolved) return null;

    const milestone = resolved.data;

    return (
        <>
            <MilestoneForm milestone={milestone} />
        </>
    );
};

export default EditMilestonePage;
