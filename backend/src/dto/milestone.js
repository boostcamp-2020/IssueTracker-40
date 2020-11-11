import { IsDateString, IsNumberString, IsString } from "class-validator";

class AddMilestoneRequestBody {
    @IsString()
    title;

    @IsString()
    description;

    @IsDateString()
    dueDate;
}

class GetMilestoneRequestParams {
    @IsNumberString()
    milestoneId;
}

export { AddMilestoneRequestBody, GetMilestoneRequestParams };
