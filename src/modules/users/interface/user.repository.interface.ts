import { User } from '../entity/user.entity';

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract save(user: Partial<User>): Promise<User>;
}
