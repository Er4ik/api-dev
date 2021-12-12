import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantModule } from './applicant/applicant.module';
import { PositionModule } from './position/position.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserModule } from './user/user.module';
import { HelperModule } from './helper/helper.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		PositionModule,
		ApplicantModule,
		UserModule,
		HelperModule,
		FileModule,
		AuthModule,
		MailerModule.forRootAsync({
			useFactory: () => ({
				transport: {
					host: 'smtp.gmail.com',
					port: 587,
					secure: false,
					auth: {
						user: 'test@gmail.com',
						pass: 'password',
					},
				},
				defaults: {
					from: '"nest-modules" test@gmail.com',
				},
				template: {
					dir: process.cwd() + '/templates/',
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
