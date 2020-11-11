import { IsString, IsEmail, Length } from "class-validator";

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
    @Length(4, 20)
    name;

    @IsString()
    password;
}

export { LoginRequestBody, SignupRequestBody };
