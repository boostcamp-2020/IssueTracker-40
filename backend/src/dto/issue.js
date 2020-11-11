import { Transform } from "class-transformer";
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

class GetIssuesRequestQuery {
    @IsOptional()
    @IsString()
    q;

    @Transform((value) => parseInt(value, 10))
    @IsNumber()
    page;
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

export {
    AddIssueRequestBody,
    UserToIssueRequestParams,
    CreateReadCommentRequestParams,
    AddCommentRequestBody,
    UpdateDeleteCommentRequestParams,
    GetIssuesRequestQuery
};
