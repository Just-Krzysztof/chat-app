import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'
import { RegisterDto } from './dto/register.dto'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { SessionGuard } from './session.guard'
import { PrismaService } from 'src/prisma/prisma.service'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService
  ) {}

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, sessionId } = await this.authService.userRegister(body)
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    })
    return user
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, sessionId } = await this.authService.login(body)
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    })
    return user
  }

  @UseGuards(SessionGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.cookies?.sessionId as string

    if (sessionId) {
      await this.prisma.session.delete({ where: { id: sessionId } })

      res.clearCookie('sessionId', {
        httpOnly: true,
        sameSite: 'lax',
      })
    }

    return { message: 'Logged out successfully' }
  }
}
