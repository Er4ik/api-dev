
import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HelperPosApp, ValidationBody } from "src/helper/helper.service";
import { Repository } from "typeorm";
import { applicants } from "./applicant.entity";
import { applicantCreateBody, applicantUpdateBody, getAllApplQuery } from "./applicant.interface";

export class ApplicantService {
    constructor(
        @InjectRepository(applicants)
        private readonly applicantRepository: Repository<applicants>,
        private readonly valid: ValidationBody,
        private readonly helper: HelperPosApp
    ) {}

    async createAppl(body: applicantCreateBody): Promise<void> {
        try {
            if(this.valid.checkValidBody(body)) {
                const bodyToDB = await this.helper.prepareBodyToAdd(body);
                await this.applicantRepository.save(bodyToDB);
                return;
            }
            throw new HttpException(`Error validate create applicant`, HttpStatus.BAD_REQUEST);
        } catch(err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async updateAppl(body: applicantUpdateBody, id: string): Promise<void> {
        try {
            if(this.valid.checkValidBody(body)) {
                const bodyToDB = await this.helper.prepareBodyToAdd(body);
                await this.applicantRepository.update({id: Number(id)}, bodyToDB);
                return;
            }
            throw new HttpException(`Error validate update applicant`, HttpStatus.BAD_REQUEST);
        } catch(err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async removeAppl(id: string): Promise<void> {
        try {
            await this.applicantRepository.delete(id);
            return;
        } catch(err) {
            throw new HttpException(`Error remove applicant -> ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}