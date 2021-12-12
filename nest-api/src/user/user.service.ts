import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { userCreateBody, userLoginBody, userUpdateBody } from "./user.interface";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { parseWithoutProcessing } from "handlebars";
//import { HelperService } from "src/helper/helper.service";

@Injectable()
export class Auth {
    constructor(private jwtService: JwtService) { }

    async registration(body: userCreateBody | userUpdateBody): Promise<string> {
        const hashPassword: string = await bcrypt.hash(body.password, 5);
        return hashPassword;
    }

    async generateToken(user: userCreateBody | userUpdateBody): Promise<string> {
        const token = { name: user.name, email: user.email };
        return this.jwtService.signAsync(token);
    }
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: Auth,
        //private readonly helper: HelperService,
        private jwtService: JwtService
    ) { }

    async checkExistsUser(email: string): Promise<userCreateBody> {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    email
                }
            })
            return user;
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async loginUser(body: userLoginBody): Promise<string> {
        try {
            const userExists = await this.checkExistsUser(body.email);

            if (userExists) {
                const passwordFlag = await bcrypt.compare(body.password, userExists.password);
                if (passwordFlag) {
                    const resBody = {
                        name: userExists.name,
                        email: userExists.email
                    }
                    const token = await this.authService.generateToken(resBody);
                    return token;
                } else {
                    throw new HttpException('Invalid email/password', HttpStatus.BAD_REQUEST);
                }
            } else {
                throw new HttpException('Users email already exists', HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async createUser(body: userCreateBody): Promise<void> {
        try {
            const userExists = await this.checkExistsUser(body.email)
            if(!userExists) {
                const password = await this.authService.registration(body);
                const bodyToDB: userCreateBody = {
                    name: body.name,
                    email: body.email,
                    password: password,
					photo: "" //доделать

                }
                await this.userRepository.save(bodyToDB);
                return;
            }
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async updateUser(body: userUpdateBody, header: object): Promise<void> {
        try {
            const token = header['authorization'].split(' ')[1];
            const verToken = this.jwtService.verify(token);
            await this.userRepository.update({ email: verToken.email }, body);
            return;
        } catch (err) {
            throw new HttpException(`Error update user -> ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(header: object): Promise<void> {
        try {
            const token = header['authorization'].split(' ')[1];
            const verToken = this.jwtService.verify(token);
            await this.userRepository.delete({ email: verToken.email });
            return;
        } catch (err) {
            throw new HttpException(`Error delete user -> ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
