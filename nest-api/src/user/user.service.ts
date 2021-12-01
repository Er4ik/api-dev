import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { createUser } from "./user.interface";

@Injectable()

export class AuthService {
    constructor(private jwtService: JwtService) {}

    async registration(body: createUser): Promise<string> {
        const hashPassword: string = await bcrypt.hash(body.password, 500);
        return hashPassword;
    }

    async generateToken(user: createUser): Promise<string> {
        const token = {name: user.name, email: user.email};
        return this.jwtService.signAsync(token);
    }
}

export class UserService {}