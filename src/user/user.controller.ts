import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() createUserDto: CreateUserDto): Promise<{ message: string, user: UserEntity }> {
    const user = await this.userService.signup(createUserDto);
    return {
      message: 'user Signup Successfully !',
      user: user
    };
  }

  // @Post('login')
  // async login(@Body() loginUserDto: LoginUserDto){
  //   return await this.userService.login(loginUserDto)
  // }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{
    message: string;
    data: {
      accessToken: {
        token: string;
      };
    };
  }> {
    const result = await this.userService.login(loginUserDto);
    return {
      message: 'User Login Successfully!',
      data: {
        accessToken: result,
      },
    };
  }


  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findUserById(@Param('id') id: number): Promise<UserEntity> {
    return await this.userService.findUserById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
