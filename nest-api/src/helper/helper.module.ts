import { Module } from "@nestjs/common";
import { HelperPosApp, ValidationBody } from "./helper.service";

@Module({
    providers: [ValidationBody, HelperPosApp]
})
export class HelperModule {}