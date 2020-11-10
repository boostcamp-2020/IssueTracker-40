import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

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

export { AddIssueRequestBody };
