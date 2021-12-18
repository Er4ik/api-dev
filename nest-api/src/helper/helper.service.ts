import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
	applicantCreateBody,
	applicantUpdateBody,
} from 'src/applicant/applicant.interface';
import {
	getAllPosQuery,
	positionCreateBody,
	positionUpdateBody,
} from 'src/position/position.interface';
import { User } from 'src/user/user.entity';
import { Like, Repository } from 'typeorm';
import {
	availableBodyValue,
	userAndBody,
	verifyDataToken,
} from './helper.interface';

@Injectable()
export class ValidationBody {
	availableValue: availableBodyValue = {
		category: ['nodejs', 'angular', 'javascript', 'react'],
		categories: ['nodejs', 'angular', 'javascript', 'react'],
		level: ['junior', 'middle', 'senior'],
		language: ['english', 'ukrainian', 'russian'],
	};

	arrFieldBody: string[] = ['language', 'categories'];
	numberFieldBody: string[] = ['salary', 'id_user'];

	checkValidBody(
		body:
			| positionCreateBody
			| positionUpdateBody
			| applicantCreateBody
			| applicantUpdateBody,
	): boolean {
		for (const key in body) {
			if (!body[key]) {
				return false;
			} else if (this.arrFieldBody.includes(key)) {
				for (const elem of body[key]) {
					if (
						!this.availableValue[key].includes(elem.toLowerCase())
					) {
						return false;
					}
				}
				continue;
			} else if (this.numberFieldBody.includes(key)) {
				if (typeof body[key] !== 'number') return false;
				else {
					if (body[key] <= 0) return false;
				}
			} else {
				if (
					this.availableValue[key] &&
					!this.availableValue[key].includes(body[key].toLowerCase())
				)
					return false;
			}
		}
		return true;
	}
}

@Injectable()
export class PreparePositionApplicant {
	async prepareQuery(query: getAllPosQuery): Promise<getAllPosQuery> {
		const fields: getAllPosQuery = {};
		for (const key in query) {
			if (key === 'tag') {
				fields['description'] = Like(`%${query[key]}%`);
				continue;
			}
			fields[key] = query[key];
		}
		return fields;
	}

	async prepareBodyToAdd(
		body:
			| applicantCreateBody
			| applicantUpdateBody
			| positionCreateBody
			| positionUpdateBody,
	) {
		const bodyToDB = {};
		const arrKey = ['language', 'categories'];
		for (const key in body) {
			if (arrKey.includes(key)) {
				bodyToDB[key] = body[key].join(',').toLowerCase();
				continue;
			}
			bodyToDB[key] = body[key];
		}
		return bodyToDB;
	}
}

@Injectable()
export class VerifyUser {
	constructor(
		private jwtService: JwtService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly helper: PreparePositionApplicant,
	) {}

	async verifyToken(header: object): Promise<verifyDataToken> {
		const token = header['authorization'].split(' ')[1];
		const verifyToken: verifyDataToken = await this.jwtService.verify(
			token,
		);
		return verifyToken;
	}

	async findUser(verifyToken: verifyDataToken): Promise<User> {
		return await this.userRepository.findOne({
			email: verifyToken.email,
		});
	}

	async prepareBodyToDB<bodyType>(
		body: bodyType,
		user: User,
	): Promise<object> {
		const bodyToDB = await this.helper.prepareBodyToAdd(body);
		bodyToDB['id_user'] = user.id;
		return bodyToDB;
	}

	async callAllFunctions<bodyType>(
		body: bodyType,
		header: object,
	): Promise<userAndBody> {
		const verifyToken: verifyDataToken = await this.verifyToken(header);
		const user: User = await this.findUser(verifyToken);
		const bodyToDB = await this.prepareBodyToDB(body, user);
		return { user, bodyToDB };
	}
}
