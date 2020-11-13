import { IsDate, IsString, IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

class AddMilestoneRequestBody {
    @IsString()
    title;

    @IsString()
    description;

    @IsString()
    dueDate;
}

class GetMilestoneRequestParams {
    @Transform((value) => parseInt(value, 10))
    @IsNumber()
    milestoneId;
}

class ChangeMilestoneRequestParams {
    @Transform((value) => parseInt(value, 10))
    @IsNumber()
    milestoneId;
}

class ChangeMilestoneRequestBody {
    @IsOptional()
    @IsString()
    title;

    @IsOptional()
    @IsString()
    description;

    @IsOptional()
    @IsString()
    state;

    @IsOptional()
    @IsString()
    dueDate;
}

class RemoveMilestoneRequestParams {
    @Transform((value) => parseInt(value, 10))
    @IsNumber()
    milestoneId;
}

export { AddMilestoneRequestBody, GetMilestoneRequestParams, ChangeMilestoneRequestBody, ChangeMilestoneRequestParams, RemoveMilestoneRequestParams };
