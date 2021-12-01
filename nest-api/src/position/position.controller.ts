import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
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
    @HttpCode(HttpStatus.CREATED)
    async createPosition(@Body() createPosBody: CreatePosBodyDto): Promise<void> {
        return await this.positionService.createPos(createPosBody);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.CREATED)
    async updatePosition(@Param('id') id: string, @Body() updatePosBody: UpdatePosBodyDto): Promise<void> {
        return await this.positionService.updatePos(id, updatePosBody);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async removePosition(@Param('id') id: string): Promise<void> {
        return await this.positionService.removePosition(id);
    }
}
