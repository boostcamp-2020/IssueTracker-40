import { IsDateString, IsString, IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

class AddMilestoneRequestBody {
    @IsString()
    title;

    @IsString()
    description;

    @IsDateString()
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
    @IsDateString()
    dueDate;
}

export { AddMilestoneRequestBody, GetMilestoneRequestParams, ChangeMilestoneRequestBody, ChangeMilestoneRequestParams };
