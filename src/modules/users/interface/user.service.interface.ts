import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';
import { UserProfileView } from '../dto/user-profile-view.dto';

export abstract class IUserService {
  abstract signup(createUserDto: CreateUserDto): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract getMyProfile(userId: number): Promise<User>;
  abstract updateStatusMessage(
    userId: number,
    statusMessage: string,
  ): Promise<User>;
  abstract updateProfileImage(
    userId: number,
    profileImageUrl: string,
  ): Promise<User>;
  abstract updatePassword(
    userId: number,
    newHashedPassword: string,
  ): Promise<void>;
  abstract findAllProfiles(): Promise<UserProfileView[]>;
}
