import { Injectable } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async userRegister(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
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

    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    return { user, sessionId }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) throw new Error('Invalid credentials')

    const isValid = await bcrypt.compare(dto.password, user.password)

    if (!isValid) throw new Error('Invalid credentials')

    const sessionId = crypto.randomUUID()

    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    return {
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    }
  }
}
