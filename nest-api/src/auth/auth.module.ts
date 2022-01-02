import { Module } from '@nestjs/common';
import { AuthService, GoogleStrategy } from './auth.service';

@Module({
	imports: [],
	providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
