import { UserRole } from './user-role.enum';

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}
