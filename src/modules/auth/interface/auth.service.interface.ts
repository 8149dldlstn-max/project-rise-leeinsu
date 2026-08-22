import { LoginDto } from '../dto/login.dto';
import { AccessTokenDto } from '../dto/access-token.dto';

export abstract class IAuthService {
  abstract login(loginDto: LoginDto): Promise<AccessTokenDto>;
}
