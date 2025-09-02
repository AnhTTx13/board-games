import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserByEmail(userEmail: string) {
    const result = await this.userRepository.findOneBy({ email: userEmail });
    if (!result) {
      return {}
    }
    result.password = ""
    return result
  }
}
