import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from './interface/user.repository.interface';
import { User } from './entity/user.entity';

@Injectable()
export class UserRepository extends IUserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ order: { nickname: 'ASC' } });
  }

  save(user: Partial<User>): Promise<User> {
    return this.userRepository.save(this.userRepository.create(user));
  }
}
