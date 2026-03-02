import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const sessionId = req.cookies?.sessionId as string

    if (!sessionId) throw new UnauthorizedException()

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session || session.expiredAt < new Date())
      throw new UnauthorizedException()

    req.user = {
      id: session.user.id,
      email: session.user.email,
    }

    return true
  }
}
