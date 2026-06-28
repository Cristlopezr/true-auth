import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { CreateUserDto } from "../../../domain/user/dto/create-user.dto";

export class CreateUserDtoImpl implements CreateUserDto {

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    name: string;

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