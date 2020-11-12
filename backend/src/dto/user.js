import { IsString, IsOptional } from "class-validator";

class GetUserQuery {
    @IsOptional()
    @IsString()
    type;
}

export { GetUserQuery };
