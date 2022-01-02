import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Req,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'src/auth/auth.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Get('/user')
	@UseGuards(AuthService)
	@HttpCode(HttpStatus.CREATED)
	async getPositionByID(@Headers() header: object): Promise<object> {
		return await this.userService.getUserByID(header);
	}

	@Get('/google')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthGuard('google'))
	async googleAuth(@Req() req) {}

	@Get('google/redirect')
	@UseGuards(AuthGuard('google'))
	googleAuthRedirect(@Req() req) {
		return this.userService.googleLogin(req);
	}

	@Post('/login')
	@HttpCode(HttpStatus.CREATED)
	async loginUser(@Body() userLoginDto: UserLoginDto): Promise<string> {
		return await this.userService.loginUser(userLoginDto);
	}

	@Post('/user')
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
	async createUser(
		@Body() createUserDto: UserCreateDto,
		@UploadedFiles() photo: object,
	): Promise<void> {
		return await this.userService.createUser(createUserDto, photo);
	}

	@Patch('/user')
	@UseGuards(AuthService)
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
	async updateUser(
		@Body() updateUserDto: UserUpdateDto,
		@Headers() header: object,
		@UploadedFiles() photo: object,
	): Promise<void> {
		return await this.userService.updateUser(updateUserDto, header, photo);
	}

	@Delete('/user')
	@UseGuards(AuthService)
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteUser(@Headers() header: object): Promise<void> {
		return await this.userService.deleteUser(header);
	}
}
