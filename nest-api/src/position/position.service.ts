import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Position } from './position.entity';
import {
	getAllPosQuery,
	positionCreateBody,
	sendMail,
	positionUpdateBody,
} from './position.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { EventEmitter } from 'stream';
import { Applicant } from 'src/applicant/applicant.entity';
import { PreparePositionApplicant, ValidationBody, VerifyUser } from 'src/helper/helper.service';
import { User } from 'src/user/user.entity';
import { userAndBody } from 'src/helper/helper.interface';

@Injectable()
export class listener {
	readonly ee = new EventEmitter();

	constructor(
		private readonly mailerService: MailerService,
		@InjectRepository(Applicant)
		private readonly applicantRepository: Repository<Applicant>,
	) {}

	private async mailer(body: object): Promise<void> {
		this.mailerService
			.sendMail(body)
			.then((success) => {
				console.log(success);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	private async prepareApp(data: positionCreateBody): Promise<Applicant[]> {
		if (data['japaneseRequired'] === true) {
			const res = await this.applicantRepository.find({
				where: {
					level: data['level'],
					japaneseKnoledge: data['japaneseRequired'],
					categories: Like(`%${data['category']}`),
				},
			});
			return res;
		}
		const res = await this.applicantRepository.find({
			where: {
				level: data['level'],
				categories: Like(`%${data['category']}`),
			},
		});
		return res;
	}

	async sendCreatedPosition(position: positionCreateBody): Promise<void> {
		const applicants = await this.prepareApp(position);
		for (const key in applicants) {
			const message: sendMail = {
				to: key['email'],
				from: 'test@gmail.com',
				subject: 'New position for you!',
				text: `
                    Category: ${position['category']}
                    Level: ${position['level']}
                    JapanseRequired: ${position['japaneseRequired']}
                `,
			};
			this.mailer(message);
		}
		return;
	}

	registerAllListeners() {
		this.ee.on('sendCreateUpdateMail', this.sendCreatedPosition);
	}
}

@Injectable()
export class PositionService {
	constructor(
		@InjectRepository(Position)
		private readonly positionRepository: Repository<Position>,
		private readonly valid: ValidationBody,
		private readonly helper: PreparePositionApplicant,
		private readonly listener: listener,
		private readonly verify: VerifyUser,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {
		listener.registerAllListeners();
	}

	async getAllPosition(query: getAllPosQuery): Promise<object> {
		try {
			const body: getAllPosQuery = await this.helper.prepareQuery(query);

			const resPos = await this.positionRepository.find({
				where: body,
			});

			return resPos;
		} catch (err) {
			throw new HttpException(
				`Error get all positions -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getPositionByID(id: string): Promise<object> {
		try {
			const resPos = await this.positionRepository.findOne(id);
			return resPos;
		} catch (err) {
			throw new HttpException(
				`Error get position by id -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createPos(body: positionCreateBody, header: object): Promise<void> {
		try {
			if (this.valid.checkValidBody(body)) {
				const dataUserAndBody: userAndBody =
					await this.verify.callFunctionsVerifyAndFindUser(body, header);
				await this.positionRepository.save(dataUserAndBody.bodyToDB);
				this.listener.ee.emit('sendCreateUpdateMail', body);
				return;
			}
			throw new HttpException(`Error validate create position`, HttpStatus.BAD_REQUEST);
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async updatePos(id: string, body: positionUpdateBody, header: object): Promise<void> {
		try {
			if (this.valid.checkValidBody(body)) {
				const dataUserAndBody: userAndBody =
					await this.verify.callFunctionsVerifyAndFindUser(body, header);
				await this.positionRepository.update(
					{ id: Number(id), id_user: dataUserAndBody.user.id },
					dataUserAndBody.bodyToDB,
				);
				return;
			}
			throw new HttpException(`Error validate update position`, HttpStatus.BAD_REQUEST);
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async removePosition(id: string, header: object): Promise<void> {
		try {
			const clearBody = {}; // in this function we don't need a request body
			const dataUserAndBody: userAndBody = await this.verify.callFunctionsVerifyAndFindUser(
				clearBody,
				header,
			);
			await this.positionRepository.delete({
				id: Number(id),
				id_user: dataUserAndBody.user.id,
			});
			return;
		} catch (err) {
			throw new HttpException(
				`Error remove position by id -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
