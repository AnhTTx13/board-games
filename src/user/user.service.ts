import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto, LoginDto, UpdateProfileDto } from "./user.dto";
import * as bcrypt from "bcrypt";
import { UserEntity } from "src/shared/entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserByEmail(userEmail: string) {
    return this.userRepository.findOneBy({ email: userEmail });
  }

  async saveUser(user: UserEntity) {
    return this.userRepository.save(user);
  }

  async createUser(dto: CreateUserDto) {
    const { email, password, username } = dto;
    const [existedEmail, existedUsername] = await Promise.all([
      this.userRepository.findOneBy({ email }),
      this.userRepository.findOneBy({ username }),
    ]);
    if (existedEmail) {
      throw new ForbiddenException("email has been taken");
    }
    if (existedUsername) {
      throw new ForbiddenException("username has been taken");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = this.userRepository.create({
      email,
      nickname: username,
      username,
      password: hashedPassword,
    });
    return newUser;
  }

  async loginUser(dto: LoginDto) {
    const { username, password } = dto;
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException("username not found");
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException("wrong password");
    }
    return user;
  }

  async updateUserProfile(userEmail: string, dto: UpdateProfileDto) {
    try {
      const { nickname, username, password, image, age } = dto;
      const user = await this.userRepository.findOneBy({
        email: userEmail,
      });
      if (!user) {
        throw new NotFoundException("user not found");
      }
      if (nickname) {
        user.nickname = nickname;
      }
      if (username) {
        user.username = username;
      }
      if (age) {
        user.age = age;
      }
      if (image) {
        user.image = image;
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
      }
      const result = await this.userRepository.save(user);
      return result;
    } catch (err) {
      throw new BadRequestException("username already exists")
    }
  }
}
