import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isEmailInUse = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isEmailInUse) {
      throw new BadRequestException('Email already in use');
    }

    const user = new User({
      email: createUserDto.email,
      password: bcrypt.hashSync(createUserDto.password, 8),
    });

    return this.userRepository.save(user);
  }

  async login(loginDto: CreateUserDto): Promise<{ id: number }> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    if (!(user && bcrypt.compareSync(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credentials are invalid');
    }

    return {
      id: user.id,
    };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }
}
