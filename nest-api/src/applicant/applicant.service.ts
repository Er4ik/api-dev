import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	HelperPosApp,
	ValidationBody,
	VerifyUser,
} from 'src/helper/helper.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Applicant } from './applicant.entity';
import {
	applicantCreateBody,
	applicantUpdateBody,
	getAllApplQuery,
} from './applicant.interface';

export class ApplicantService {
	constructor(
		@InjectRepository(Applicant)
		private readonly applicantRepository: Repository<Applicant>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly valid: ValidationBody,
		private readonly helper: HelperPosApp,
		private readonly verify: VerifyUser,
	) {}

	async getAllApplicants(query: getAllApplQuery): Promise<object> {
		try {
			const body: getAllApplQuery = await this.helper.prepareQuery(query);

			const resPos = await this.applicantRepository.find({
				where: body,
			});

			return resPos;
		} catch (err) {
			throw new HttpException(
				`Error get all applicants -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getApplicantByID(id: string): Promise<object> {
		try {
			const resPos = await this.applicantRepository.findOne(id);
			return resPos;
		} catch (err) {
			throw new HttpException(
				`Error get applicant by id -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createAppl(body: applicantCreateBody, header: object): Promise<void> {
		try {
			if (this.valid.checkValidBody(body)) {
				const dataVerify = this.verify.verifyToken(header);

				const user = await this.userRepository.findOne({
					email: dataVerify['email'],
				});

				const bodyToDB = await this.helper.prepareBodyToAdd(body);
				bodyToDB['id_user'] = user.id;

				await this.applicantRepository.save(bodyToDB);
				return;
			}
			throw new HttpException(
				`Error validate create applicant`,
				HttpStatus.BAD_REQUEST,
			);
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async updateAppl(
		id: string,
		body: applicantUpdateBody,
		header: object,
	): Promise<void> {
		try {
			if (this.valid.checkValidBody(body)) {
				const dataVerify = this.verify.verifyToken(header);

				const user = await this.userRepository.findOne({
					email: dataVerify['email'],
				});

				const bodyToDB = await this.helper.prepareBodyToAdd(body);
				bodyToDB['id_user'] = user.id;

				await this.applicantRepository.update(
					{ id_user: Number(user.id), id: Number(id) },
					bodyToDB,
				);
				return;
			}
			throw new HttpException(
				`Error validate update applicant`,
				HttpStatus.BAD_REQUEST,
			);
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async removeAppl(id: string, header: object): Promise<void> {
		try {
			const dataVerify = this.verify.verifyToken(header);

			const user = await this.userRepository.findOne({
				email: dataVerify['email'],
			});

			await this.applicantRepository.delete({
				id_user: user.id,
				id: Number(id),
			});
			return;
		} catch (err) {
			throw new HttpException(
				`Error remove applicant -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
