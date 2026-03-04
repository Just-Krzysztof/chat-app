import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthModule } from 'src/auth/auth.module'
import { UserController } from './user.controller'

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
