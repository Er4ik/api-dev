import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HelperPosApp, ValidationBody } from "src/helper/helper.service";
import { ApplicantController } from "./applicant.controller";
import { applicants } from "./applicant.entity";
import { ApplicantService } from "./applicant.service";

@Module({
    imports: [TypeOrmModule.forFeature([applicants])],
    providers: [ApplicantService, ValidationBody, HelperPosApp],
    controllers: [ApplicantController]
}) 
export class ApplicantModule{}