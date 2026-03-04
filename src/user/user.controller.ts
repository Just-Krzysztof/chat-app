import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { SessionGuard } from 'src/auth/session.guard'
import type { Request } from 'express'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  @UseGuards(SessionGuard)
  getMe(@Req() req: Request) {
    return {
      message: 'You are logged in!',
      user: req.user,
    }
  }

  @Get('all')
  @UseGuards(SessionGuard)
  async getAll() {
    return this.userService.getAllUsers()
  }
}
