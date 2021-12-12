import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HelperPosApp, ValidationBody, VerifyUser } from './helper.service';

@Module({
	imports: [
		JwtModule.register({
			secret: 'SECRET',
			signOptions: {
				expiresIn: '24h',
			},
		}),
	],
	providers: [ValidationBody, HelperPosApp, VerifyUser],
})
export class HelperModule {}
