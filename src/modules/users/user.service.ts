import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUserService } from './interface/user.service.interface';
import { IUserRepository } from './interface/user.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UserProfileView } from './dto/user-profile-view.dto';
import { ERROR_MESSAGE, PASSWORD_HASH_ROUNDS } from '../../common/constants';

@Injectable()
export class UserService extends IUserService {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGE.EMAIL_ALREADY_EXIST);
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      PASSWORD_HASH_ROUNDS,
    );

    return this.userRepository.save({
      email: createUserDto.email,
      password: hashedPassword,
      nickname: createUserDto.nickname,
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getMyProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }
    return user;
  }

  async updateStatusMessage(
    userId: number,
    statusMessage: string,
  ): Promise<User> {
    const user = await this.getMyProfile(userId);
    user.statusMessage = statusMessage;
    return this.userRepository.save(user);
  }

  async updateProfileImage(
    userId: number,
    profileImageUrl: string,
  ): Promise<User> {
    const user = await this.getMyProfile(userId);
    user.profileImageUrl = profileImageUrl;
    return this.userRepository.save(user);
  }

  async updatePassword(
    userId: number,
    newHashedPassword: string,
  ): Promise<void> {
    const user = await this.getMyProfile(userId);
    user.password = newHashedPassword;
    await this.userRepository.save(user);
  }

  async findAllProfiles(): Promise<UserProfileView[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      statusMessage: user.statusMessage,
      profileImageUrl: user.profileImageUrl,
    }));
  }
}
