import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { userCreateBody, userLoginBody, userUpdateBody } from './user.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyUser } from 'src/helper/helper.service';
import { userAndBody, verifyDataToken } from 'src/helper/helper.interface';
import { FileHandler } from 'src/helper/helper.service';
import { Position } from 'src/position/position.entity';
import { Applicant } from 'src/applicant/applicant.entity';

@Injectable()
export class Auth {
	constructor(private jwtService: JwtService) {}

	async registration(body: userCreateBody | userUpdateBody): Promise<string> {
		const hashPassword: string = await bcrypt.hash(body.password, 5);
		return hashPassword;
	}

	async generateToken(user: userCreateBody | userUpdateBody): Promise<string> {
		const token = { name: user.name, email: user.email };
		return this.jwtService.signAsync(token);
	}
}

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Position)
		private readonly positionRepository: Repository<Position>,
		@InjectRepository(Applicant)
		private readonly applicantRepository: Repository<Applicant>,
		private readonly authService: Auth,
		private readonly verify: VerifyUser,
		private readonly fileService: FileHandler,
	) {}

	async checkExistsUser(email: string): Promise<userCreateBody> {
		try {
			const user = await this.userRepository.findOne({
				where: {
					email,
				},
			});
			return user;
		} catch (err) {
			throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getUserByID(header: object): Promise<object> {
		try {
			const clearBody = {}; // in this function we don't need a request body
			const dataUserAndBody: userAndBody = await this.verify.callFunctionsVerifyAndFindUser(
				clearBody,
				header,
			);
			return dataUserAndBody.user;
		} catch (err) {
			throw new HttpException(
				`Error get user by id -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	googleLogin(req) {
		if (!req.user) {
			return 'No user from google';
		}

		return {
			message: 'User information from google',
			user: req.user,
		};
	}

	async loginUser(body: userLoginBody): Promise<string> {
		try {
			const userExists = await this.checkExistsUser(body.email);
			if (userExists) {
				const passwordFlag = await bcrypt.compare(body.password, userExists.password);
				if (passwordFlag) {
					const resBody = {
						name: userExists.name,
						email: userExists.email,
					};
					const token = await this.authService.generateToken(resBody);
					return token;
				} else {
					throw new HttpException('Invalid email/password', HttpStatus.BAD_REQUEST);
				}
			} else {
				throw new HttpException(`User doesn't exists`, HttpStatus.BAD_REQUEST);
			}
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async createUser(body: userCreateBody, photo: object): Promise<void> {
		try {
			const userExists = await this.checkExistsUser(body.email);
			if (!userExists) {
				const password = await this.authService.registration(body);
				const bodyToDB: userCreateBody = {
					name: body.name,
					email: body.email,
					password: password,
					photo: '',
				};
				if (photo['photo']) {
					const namePhoto = await this.fileService.saveFile(photo['photo'][0]);
					bodyToDB.photo = namePhoto;
					await this.userRepository.save(bodyToDB);
					return;
				}

				await this.userRepository.save(bodyToDB);
				return;
			}
			throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async updateUser(body: userUpdateBody, header: object, photo: object): Promise<void> {
		try {
			const emailNameFromToken: verifyDataToken = await this.verify.verifyToken(header);
			const user = await this.userRepository.update(
				{ email: emailNameFromToken.email },
				body,
			);
			if (photo) {
				await this.fileService.updateFile(user['photo'], photo['photo'][0]);
			}
			return;
		} catch (err) {
			throw new HttpException(
				`Error update user -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteUser(header: object): Promise<void> {
		try {
			const emailNameFromToken: verifyDataToken = await this.verify.verifyToken(header);
			const user = await this.userRepository.findOne({ email: emailNameFromToken.email });
			await this.userRepository.delete({
				email: emailNameFromToken.email,
			});
			await this.positionRepository.delete({
				id_user: user.id,
			});
			await this.applicantRepository.delete({
				id_user: user.id,
			});
			await this.fileService.removeFile(user['photo']);
			return;
		} catch (err) {
			throw new HttpException(
				`Error delete user -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
