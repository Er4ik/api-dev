import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import {
	HelperPosApp,
	ValidationBody,
	VerifyUser,
} from 'src/helper/helper.service';
import { User } from 'src/user/user.entity';
import { Auth } from 'src/user/user.service';
import { ApplicantController } from './applicant.controller';
import { Applicant } from './applicant.entity';
import { ApplicantService } from './applicant.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Applicant, User]),
		JwtModule.register({
			secret: 'SECRET',
			signOptions: {
				expiresIn: '24h',
			},
		}),
	],
	providers: [
		ApplicantService,
		ValidationBody,
		HelperPosApp,
		AuthService,
		VerifyUser,
		Auth,
	],
	controllers: [ApplicantController],
})
export class ApplicantModule {}
