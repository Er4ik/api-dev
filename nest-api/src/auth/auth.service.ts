import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: 'http://localhost:3000/google/redirect',
			scope: ['email', 'profile'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		const { name, emails, photos } = profile;
		const user = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken,
		};
		done(null, user);
	}
}

@Injectable()
export class AuthService implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest();
		try {
			const authHeader = req.headers.authorization;
			const bearer = authHeader.split(' ')[0].toLowerCase();
			const token = authHeader.split(' ')[1];

			if (bearer !== 'bearer' || !token) {
				throw new UnauthorizedException({
					message: `User doesn't authorized`,
				});
			}
			return true;
		} catch (e) {
			throw new UnauthorizedException({
				message: `User doesn't authorized`,
			});
		}
	}
}
