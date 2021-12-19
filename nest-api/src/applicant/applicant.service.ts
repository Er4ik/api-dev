import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userAndBody } from 'src/helper/helper.interface';
import { PreparePositionApplicant, ValidationBody, VerifyUser } from 'src/helper/helper.service';
import { Repository } from 'typeorm';
import { Applicant } from './applicant.entity';
import { applicantCreateBody, applicantUpdateBody, getAllApplQuery } from './applicant.interface';

export class ApplicantService {
	constructor(
		@InjectRepository(Applicant)
		private readonly applicantRepository: Repository<Applicant>,
		private readonly valid: ValidationBody,
		private readonly helper: PreparePositionApplicant,
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
				const dataUserAndBody: userAndBody = await this.verify.callAllFunctions(
					body,
					header,
				);
				await this.applicantRepository.save(dataUserAndBody.bodyToDB);
				return;
			}
			throw new HttpException(`Error validate create applicant`, HttpStatus.BAD_REQUEST);
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async updateAppl(id: string, body: applicantUpdateBody, header: object): Promise<void> {
		try {
			if (this.valid.checkValidBody(body)) {
				const dataUserAndBody: userAndBody = await this.verify.callAllFunctions(
					body,
					header,
				);
				await this.applicantRepository.update(
					{
						id_user: Number(dataUserAndBody.user.id),
						id: Number(id),
					},
					dataUserAndBody.bodyToDB,
				);
				return;
			}
			throw new HttpException(`Error validate update applicant`, HttpStatus.BAD_REQUEST);
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async removeAppl(id: string, header: object): Promise<void> {
		try {
			const clearBody = {}; // in this function we don't need a request body
			const dataUserAndBody: userAndBody = await this.verify.callAllFunctions(
				clearBody,
				header,
			);
			await this.applicantRepository.delete({
				id_user: dataUserAndBody.user.id,
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
