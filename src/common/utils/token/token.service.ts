import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ENV_KEYS } from '../../constants';
import { AuthenticatedUser } from '../../types/authenticated-user.type';

@Injectable()
export class TokenService {
  private readonly secret: string;
  private readonly accessTokenExpirationSeconds: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.secret = this.configService.get<string>(ENV_KEYS.JWT_SECRET)!;
    this.accessTokenExpirationSeconds = Number(
      this.configService.get<string>(ENV_KEYS.JWT_ACCESS_EXPIRATION_SECONDS),
    );
  }

  signAccessToken(authenticatedUser: AuthenticatedUser): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        role: authenticatedUser.role,
      },
      { secret: this.secret, expiresIn: this.accessTokenExpirationSeconds },
    );
  }

  /** 검증 실패(만료·위조)는 null 반환 — 예외 변환은 호출부(가드)의 책임 */
  async verifyAccessToken(token: string): Promise<AuthenticatedUser | null> {
    try {
      return await this.jwtService.verifyAsync<AuthenticatedUser>(token, {
        secret: this.secret,
      });
    } catch {
      return null;
    }
  }
}
