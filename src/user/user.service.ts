import { LoginUserDto } from './dto/login-user.dto';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private configService: ConfigService
  ) { }

  private generateJwtToken(email:string, password:string){
    const payload = {email, password};
    const secretToken = this.configService.get('ACCESS_TOKEN_SECRET');
    const expiresToken = { expiresIn: '1h' };
    const getToken = jwt.sign(payload,secretToken,expiresToken);
    console.log({token:getToken});
    return { token:getToken};
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    if (!email) {
      throw new BadRequestException("Email is required");
    }
    return await this.usersRepository.findOneBy({ email });
  }


  async signup(createUserDto: CreateUserDto): Promise<UserEntity> {
    const {name, email, password } = createUserDto;

    const userExists = await this.findUserByEmail(createUserDto.email);

    if (userExists) {
      throw new BadRequestException("Email is Already Exists!")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = this.usersRepository.create({
      name:name,
      email: email,
      password: hashPassword
    });
    //console.log(newUser);
    return this.usersRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto){
    const { email, password } = loginUserDto;
    const userExists = await this.usersRepository.findOne({ where: { email } });
    
    if (!userExists) {
      throw new BadRequestException("Bad creadential")
    }
    // Generate JWT Token
    const token = this.generateJwtToken(email, password)

    const isPasswordValid = await bcrypt.compare(password, userExists.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid Credentials: Password not valid',
      );
    }
    return token;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user; 
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
