import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty({message:"Name can not be Empty"})
    @IsEmail({},{message:"Please Provide a Valid Email"})
    email: string;

    @IsNotEmpty({message:"Name can not be Empty"})
    @MinLength(5,{message:"Password should be contain 5 Character"})
    password: string;
}