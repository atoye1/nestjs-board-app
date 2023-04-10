import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtStrategy } from './jwt.strategy';
import * as config from 'config';

const jwtConfig: any = config.get('jwt');

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  // jwt strategy를 사용할 수 있게 등록
  providers: [AuthService, jwtStrategy],
  // 다른 모듈에서도 사용가능하도록 export
  exports: [jwtStrategy, PassportModule],
})
export class AuthModule {}
