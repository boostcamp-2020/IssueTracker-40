import React from "react";

const IssueDetailPage = ({ match }) => {
    const { params } = match;

    return (
        <>
            <p> {params.issueId}번 이슈 상세페이지입니다</p>
        </>
    );
};

export default IssueDetailPage;
