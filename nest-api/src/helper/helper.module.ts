import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { PreparePositionApplicant, ValidationBody, VerifyUser } from './helper.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			secret: 'SECRET',
			signOptions: {
				expiresIn: '24h',
			},
		}),
	],
	providers: [ValidationBody, PreparePositionApplicant, VerifyUser],
})
export class HelperModule {}
