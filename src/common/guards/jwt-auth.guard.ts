import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../utils/token/token.service';
import { BEARER_TOKEN_PREFIX, ERROR_MESSAGE } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader: string | undefined =
      request.headers['authorization'];

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith(BEARER_TOKEN_PREFIX)
    ) {
      throw new UnauthorizedException(ERROR_MESSAGE.UNAUTHORIZED);
    }

    const token = authorizationHeader.slice(BEARER_TOKEN_PREFIX.length);
    const authenticatedUser = await this.tokenService.verifyAccessToken(token);
    if (!authenticatedUser) {
      throw new UnauthorizedException(ERROR_MESSAGE.TOKEN_INVALID);
    }

    request.user = authenticatedUser;
    return true;
  }
}
