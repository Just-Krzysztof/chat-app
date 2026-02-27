import { Injectable } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

@Injectable()
export class AuthService {
  async userRegister(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        avatar: dto.avatar,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    })

    const sessionId = crypto.randomUUID()

    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    return { user, sessionId }
  }
}
