import { IsArray, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

class AddIssueRequestBody {
    @IsString()
    title;

    @IsString()
    content;

    @IsOptional()
    @IsArray()
    assignees;

    @IsOptional()
    @IsArray()
    labels;

    @IsOptional()
    @IsNumber()
    milestone;
}

class UserToIssueRequestParams {
    @IsNumberString()
    issueId;

    @IsNumberString()
    assigneeId;
}

class CreateReadCommentRequestParams {
    @IsNumberString()
    issueId;
}

class UpdateDeleteCommentRequestParams {
    @IsNumberString()
    issueId;

    @IsNumberString()
    commentId;
}

class AddCommentRequestBody {
    @IsString()
    content;
}

class IssueMilestoneRequestParams {
    @IsNumberString()
    issueId;

    @IsNumberString()
    milestoneId;
}

export {
    AddIssueRequestBody,
    UserToIssueRequestParams,
    CreateReadCommentRequestParams,
    AddCommentRequestBody,
    UpdateDeleteCommentRequestParams,
    IssueMilestoneRequestParams
};
