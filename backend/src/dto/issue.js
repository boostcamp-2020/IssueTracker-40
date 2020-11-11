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

class CommentRequestParams {
    @IsNumberString()
    issueId;
}

class AddCommentRequestBody {
    @IsString()
    content;
}

export { AddIssueRequestBody, UserToIssueRequestParams, CommentRequestParams, AddCommentRequestBody };
