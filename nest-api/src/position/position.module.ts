import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from 'src/applicant/applicant.entity';
import { AuthService } from 'src/auth/auth.service';
import { PreparePositionApplicant, ValidationBody, VerifyUser } from 'src/helper/helper.service';
import { User } from 'src/user/user.entity';
import { Auth } from 'src/user/user.service';
import { PositionController } from './position.controller';
import { Position } from './position.entity';
import { listener, PositionService } from './position.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Position, Applicant, User]),
		JwtModule.register({
			secret: 'SECRET',
			signOptions: {
				expiresIn: '24h',
			},
		}),
	],
	providers: [
		PositionService,
		listener,
		ValidationBody,
		PreparePositionApplicant,
		AuthService,
		VerifyUser,
		Auth,
	],
	controllers: [PositionController],
})
export class PositionModule {}
