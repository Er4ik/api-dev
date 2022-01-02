import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from 'src/applicant/applicant.entity';
import { AuthService, GoogleStrategy } from 'src/auth/auth.service';
import { FileHandler, PreparePositionApplicant, VerifyUser } from 'src/helper/helper.service';
import { Position } from 'src/position/position.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Auth, UserService } from './user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Position, Applicant]),
		JwtModule.register({
			secret: 'SECRET',
			signOptions: {
				expiresIn: '24h',
			},
		}),
	],
	controllers: [UserController],
	providers: [
		UserService,
		AuthService,
		Auth,
		VerifyUser,
		PreparePositionApplicant,
		FileHandler,
		GoogleStrategy,
	],
})
export class UserModule {}
