import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUserService } from '../users/interface/user.service.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entity/user.entity';
import { IAuthService } from './interface/auth.service.interface';
import { LoginDto } from './dto/login.dto';
import { AccessTokenDto } from './dto/access-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: IUserService,
    private readonly authService: IAuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    description: '이메일·비밀번호·비밀번호 확인·닉네임으로 가입한다.',
  })
  @ApiResponse({ status: 201, description: '가입된 사용자', type: User })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 409, description: '이미 가입된 이메일' })
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.signup(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그인',
    description: '이메일·비밀번호로 인증 후 JWT 액세스 토큰을 발급한다.',
  })
  @ApiResponse({ status: 200, description: '액세스 토큰', type: AccessTokenDto })
  @ApiResponse({ status: 401, description: '이메일 또는 비밀번호 불일치' })
  login(@Body() loginDto: LoginDto): Promise<AccessTokenDto> {
    return this.authService.login(loginDto);
  }
}
