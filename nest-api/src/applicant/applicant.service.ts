import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	HelperPosApp,
	ValidationBody,
	VerifyUser,
} from 'src/helper/helper.service';
import { Repository } from 'typeorm';
import { applicants } from './applicant.entity';
import {
	applicantCreateBody,
	applicantUpdateBody,
	getAllApplQuery,
} from './applicant.interface';

export class ApplicantService {
	constructor(
		@InjectRepository(applicants)
		private readonly applicantRepository: Repository<applicants>,
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
				const dataVerify = this.verify.verifyToken(header); // доделать
				const bodyToDB = await this.helper.prepareBodyToAdd(body);

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

	async updateAppl(body: applicantUpdateBody, header: object): Promise<void> {
		try {
			if (this.valid.checkValidBody(body)) {
				const dataVerify = this.verify.verifyToken(header); // доделать
				const bodyToDB = await this.helper.prepareBodyToAdd(body);
				await this.applicantRepository.update(
					{ id: Number() }, // add id
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

	async removeAppl(header: object): Promise<void> {
		try {
			const dataVerify = this.verify.verifyToken(header); // доделать
			await this.applicantRepository.delete(""); // add id
			return;
		} catch (err) {
			throw new HttpException(
				`Error remove applicant -> ${err}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
