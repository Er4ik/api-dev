import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { getAllApplQuery } from './applicant.interface';
import { ApplicantService } from './applicant.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';

@Controller('applicants')
export class ApplicantController {
    constructor(private readonly applicantService: ApplicantService) {}
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createApplicant(@Body() body: CreateApplicantDto): Promise<void> {
        return await this.applicantService.createAppl(body);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.CREATED)
    async updateApplicant(@Body() body: UpdateApplicantDto, @Param("id") id: string): Promise<void> {
        return await this.applicantService.updateAppl(body, id);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeApplicant(@Param("id") id: string): Promise<void> {
        return await this.applicantService.removeAppl(id);
    }
}
