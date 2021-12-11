import { Module } from "@nestjs/common";
import { HelperPosApp, ValidationBody, VerifyUser } from "./helper.service";

@Module({
    providers: [ValidationBody, HelperPosApp, VerifyUser]
})
export class HelperModule {}