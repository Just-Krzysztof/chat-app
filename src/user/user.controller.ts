import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { SessionGuard } from 'src/auth/session.guard'
import type { Request } from 'express'

@Controller('user')
export class UserController {
  @Get('me')
  @UseGuards(SessionGuard)
  getMe(@Req() req: Request) {
    return {
      message: 'You are logged in!',
      user: req.user,
    }
  }
}
