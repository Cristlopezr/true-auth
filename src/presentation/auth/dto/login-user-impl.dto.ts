import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { LoginUserDto } from "../../../domain/auth/dto/login-user.dto";

export class LoginUserDtoImpl implements LoginUserDto {

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have an uppercase, lowercase letter and a number'
    })
    password: string;
}