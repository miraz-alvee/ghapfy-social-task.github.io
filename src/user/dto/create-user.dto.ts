import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { LoginUserDto } from "./login-user.dto";

export class CreateUserDto extends LoginUserDto  {
    @IsNotEmpty({message:"Name can not be Null"})
    @IsString({message:"Name should be a String"})
    name : string;

}
