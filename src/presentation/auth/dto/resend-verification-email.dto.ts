import { IsEmail, IsString } from "class-validator";

export class ResendVerificationEmailDto {

    @IsEmail()
    @IsString()
    email: string;
}