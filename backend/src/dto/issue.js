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

export { AddIssueRequestBody, UserToIssueRequestParams };
