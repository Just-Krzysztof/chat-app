import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { WsAuthService } from './ws-auth.service'

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, WsAuthService],
  exports: [WsAuthService],
})
export class AuthModule {}
