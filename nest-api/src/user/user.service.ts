import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createUser } from "./user.interface";
import * as bcrypt from "bcryptjs";

@Injectable()
export class RegistrService {
    constructor(private jwtService: JwtService) {}

    async registration(body: createUser): Promise<string> {
        const hashPassword: string = await bcrypt.hash(body.password, 5);
        return hashPassword;
    }

    async generateToken(user: createUser): Promise<string> {
        const token = {name: user.name, email: user.email};
        return this.jwtService.signAsync(token);
    }
}

@Injectable()
export class UserService {}