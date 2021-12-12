import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import {
	HelperPosApp,
	ValidationBody,
	VerifyUser,
} from 'src/helper/helper.service';
import { ApplicantController } from './applicant.controller';
import { applicants } from './applicant.entity';
import { ApplicantService } from './applicant.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([applicants]),
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
	],
	controllers: [ApplicantController],
})
export class ApplicantModule {}
