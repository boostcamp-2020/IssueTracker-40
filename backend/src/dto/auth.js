import { IsString, IsEmail } from "class-validator";

class LoginRequestBody {
    @IsString()
    @IsEmail()
    email;

    @IsString()
    password;
}

class SignupRequestBody {
    @IsString()
    @IsEmail()
    email;

    @IsString()
    name;

    @IsString()
    password;
}

export { LoginRequestBody, SignupRequestBody };
