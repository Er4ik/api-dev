import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreatePosBodyDto } from './dto/create-position.dto';
import { UpdatePosBodyDto } from './dto/update-position.dto';
import { getAllPosQuery } from './position.interface';
import { PositionService } from './position.service';

@Controller('positions')
export class PositionController {
    constructor(private readonly positionService: PositionService) {}
    
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllPositions(@Query() query: getAllPosQuery): Promise<object> { 
        return await this.positionService.getAllPosition(query);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async getPositionByID(@Param("id") id: string): Promise<object> {
        return await this.positionService.getPositionByID(id);
    }

    @Post()
    @UseGuards(AuthService)
    @HttpCode(HttpStatus.CREATED)
    async createPosition(@Body() createPosBody: CreatePosBodyDto, @Headers() header: object): Promise<void> {
        return await this.positionService.createPos(createPosBody, header);
    }

    @Patch(":id")
    @UseGuards(AuthService)
    @HttpCode(HttpStatus.CREATED)
    async updatePosition(@Param('id') id: string, @Body() updatePosBody: UpdatePosBodyDto, @Headers() header: object): Promise<void> {
        return await this.positionService.updatePos(id, updatePosBody, header);
    }

    @Delete(":id")
    @UseGuards(AuthService)
    @HttpCode(HttpStatus.NO_CONTENT)
    async removePosition(@Param('id') id: string, @Headers() header: object): Promise<void> {
        return await this.positionService.removePosition(id, header);
    }
}
