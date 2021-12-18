import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { getAllApplQuery } from './applicant.interface';
import { ApplicantService } from './applicant.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';

@Controller('applicants')
export class ApplicantController {
	constructor(private readonly applicantService: ApplicantService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getAllApplicants(@Query() query: getAllApplQuery): Promise<object> {
		return await this.applicantService.getAllApplicants(query);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getPositionByID(@Param('id') id: string): Promise<object> {
		return await this.applicantService.getApplicantByID(id);
	}

	@Post()
	@UseGuards(AuthService)
	@HttpCode(HttpStatus.CREATED)
	async createApplicant(
		@Body() creatApplDto: CreateApplicantDto,
		@Headers() header: object,
	): Promise<void> {
		return await this.applicantService.createAppl(creatApplDto, header);
	}

	@Patch(':id')
	@UseGuards(AuthService)
	@HttpCode(HttpStatus.CREATED)
	async updateApplicant(
		@Param('id') id: string,
		@Body() updateApplDto: UpdateApplicantDto,
		@Headers() header: object,
	): Promise<void> {
		return await this.applicantService.updateAppl(
			id,
			updateApplDto,
			header,
		);
	}

	@Delete(':id')
	@UseGuards(AuthService)
	@HttpCode(HttpStatus.NO_CONTENT)
	async removeApplicant(
		@Param('id') id: string,
		@Headers() header: object,
	): Promise<void> {
		return await this.applicantService.removeAppl(id, header);
	}
}
