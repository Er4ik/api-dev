import { Body, Controller, Delete, Headers, HttpCode, HttpStatus, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { UserService } from "./user.service";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/login')
    @HttpCode(HttpStatus.CREATED)
    async loginUser(@Body() userLoginDto: UserLoginDto): Promise<string> {
        return await this.userService.loginUser(userLoginDto);
    }

    @Post('/user')
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserDto: UserCreateDto): Promise<void> {
        return await this.userService.createUser(createUserDto);
    }

    @Patch('/user')
    @UseGuards(AuthService)
    @HttpCode(HttpStatus.CREATED)
    async updateUser(@Body() updateUserDto: UserUpdateDto, @Headers() header: object): Promise<void> {
        return await this.userService.updateUser(updateUserDto, header);
    }

    @Delete('/user')
    @UseGuards(AuthService)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Headers() header: object): Promise<void> {
        return await this.userService.deleteUser(header);
    }
}
