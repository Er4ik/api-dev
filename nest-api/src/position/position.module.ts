import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { applicants } from "src/applicant/applicant.entity";
import { AuthService } from "src/auth/auth.service";
import { HelperPosApp, ValidationBody, VerifyUser } from "src/helper/helper.service";
import { PositionController } from "./position.controller";
import { positions } from "./position.entity";
import { listener, PositionService } from "./position.service";

@Module({
    imports: [TypeOrmModule.forFeature([positions, applicants]),
        JwtModule.register({
            secret: "SECRET",
            signOptions: {
                expiresIn: "24h"
            }
        })
    ],
    providers: [PositionService, listener, ValidationBody, HelperPosApp, AuthService, VerifyUser],
    controllers: [PositionController]
}) 
export class PositionModule{}