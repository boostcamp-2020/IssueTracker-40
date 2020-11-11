import { IsString, IsEmail } from "class-validator";

class LoginRequestBody {
    @IsString()
    @IsEmail()
    email;

    @IsString()
    password;
}

export { LoginRequestBody };
