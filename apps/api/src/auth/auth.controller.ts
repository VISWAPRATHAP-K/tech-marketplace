import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body('email') email: string) {
    return this.authService.login(email);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register customer or store owner' })
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current profile' })
  async getProfile(@Headers('authorization') authHeader?: string) {
    const token = (authHeader || '').replace('Bearer ', '');
    return this.authService.getProfile(token);
  }
}
