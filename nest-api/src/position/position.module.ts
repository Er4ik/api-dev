import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { applicants } from "src/applicant/applicant.entity";
import { HelperPosApp, ValidationBody } from "src/helper/helper.service";
import { PositionController } from "./position.controller";
import { positions } from "./position.entity";
import { listener, PositionService } from "./position.service";

@Module({
    imports: [TypeOrmModule.forFeature([positions, applicants])],
    providers: [PositionService, listener, ValidationBody, HelperPosApp],
    controllers: [PositionController]
}) 
export class PositionModule{}