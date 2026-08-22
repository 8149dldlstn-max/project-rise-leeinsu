import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IAuthService } from './interface/auth.service.interface';
import { LoginDto } from './dto/login.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import { IUserService } from '../users/interface/user.service.interface';
import { TokenService } from '../../common/utils/token/token.service';
import { ERROR_MESSAGE } from '../../common/constants';

@Injectable()
export class AuthService extends IAuthService {
  constructor(
    private readonly userService: IUserService,
    private readonly tokenService: TokenService,
  ) {
    super();
  }

  async login(loginDto: LoginDto): Promise<AccessTokenDto> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGE.EMAIL_PASSWORD_NOT_MATCH);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGE.EMAIL_PASSWORD_NOT_MATCH);
    }

    const accessToken = await this.tokenService.signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return new AccessTokenDto(accessToken);
  }
}
