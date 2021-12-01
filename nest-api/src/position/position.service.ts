import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { positions } from "./position.entity";
import { getAllPosQuery, positionCreateBody, sendMail, positionUpdateBody } from "./position.interface";
import { MailerService } from '@nestjs-modules/mailer';
import { EventEmitter } from "stream";
import { applicants } from "src/applicant/applicant.entity";
import { HelperPosApp, ValidationBody } from "src/helper/helper.service";

@Injectable()
export class listener {
    readonly ee = new EventEmitter();

    constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(applicants)
    private readonly applicantRepository: Repository<applicants>,
    ) {}

    private async mailer(body: object): Promise<void> {
        this.mailerService.sendMail(body)
        .then((success) => {
            console.log(success)
        })
        .catch((err) => {
            console.log(err)
        });
    }

    private async prepareApp(data: positionCreateBody): Promise<applicants[]> {
        if(data['japaneseRequired'] === true) {  
            const res =  await this.applicantRepository.find({
                where: {
                    level: data['level'],
                    japaneseKnoledge: data['japaneseRequired'],
                    categories:  Like(`%${data['category']}`)
                }
            })
            return res;
        }
        const res = await this.applicantRepository.find({
            where: {
                level: data['level'],
                categories: Like(`%${data['category']}`)
            }
        })
        return res;
    }

    async sendCreatedPosition(position: positionCreateBody): Promise<void> {
        const applicants = await this.prepareApp(position);
        for(const key in applicants) {
            const message: sendMail = {
                to: key['email'],
                from: 'test@gmail.com',
                subject: "New position for you!",
                text: `
                    Category: ${position['category']}
                    Level: ${position['level']}
                    JapanseRequired: ${position['japaneseRequired']}
                `,
            }   
            this.mailer(message);
        }
        return;
    }

    registerAllListeners() {
        this.ee.on('sendCreateUpdateMail', this.sendCreatedPosition);
    }

}

@Injectable()
export class PositionService {
    constructor(
        @InjectRepository(positions)
        private readonly positionRepository: Repository<positions>,
        private readonly valid: ValidationBody,
        private readonly helper: HelperPosApp,
        private readonly listener: listener
    ) {
        listener.registerAllListeners();
    }

    async getAllPosition(query: getAllPosQuery): Promise<object> {
        try {
            const body: getAllPosQuery = await this.helper.prepareQuery(query);
            
            const resPos = await this.positionRepository.find({
                where: body
            });
            
            return resPos;
        } catch(err) {
            throw new HttpException(`Error get all positions -> ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPositionByID(id: string): Promise<object> {
        try {
            const resPos = await this.positionRepository.findOne(id)
            return resPos;
        } catch(err) {
            throw new HttpException(`Error get position by id -> ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createPos(body: positionCreateBody): Promise<void> {
        try {
            if(this.valid.checkValidBody(body)) {
                const bodyToDB = await this.helper.prepareBodyToAdd(body);
                await this.positionRepository.save(bodyToDB);
                // this.listener.ee.emit('sendCreateUpdateMail', body);
                return;
            } 
            throw new HttpException(`Error validate create position`, HttpStatus.BAD_REQUEST);
        } catch(err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async updatePos(id: string, body: positionUpdateBody): Promise<void> {
        try {
            if(this.valid.checkValidBody(body)) {
                const bodyToDB = await this.helper.prepareBodyToAdd(body);
                await this.positionRepository.update({id: Number(id)}, bodyToDB);
                return;
            }
            throw new HttpException(`Error validate update position`, HttpStatus.BAD_REQUEST);
        } catch(err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async removePosition(id: string): Promise<void> {
        try {
            await this.positionRepository.delete(id);
            return;
        } catch(err) {
            throw new HttpException(`Error remove position by id -> ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}