import { IsNotEmpty, IsString } from "class-validator";

export class ValidateEmailTokenDto {

    @IsString()
    @IsNotEmpty()
    token: string;
}