import { Injectable } from "@nestjs/common";
import { applicantCreateBody, applicantUpdateBody } from "src/applicant/applicant.interface";
import { getAllPosQuery, positionCreateBody, positionUpdateBody } from "src/position/position.interface";
import { Like } from "typeorm";
import { availableBodyValue } from "./helper.interface";


@Injectable()
export class ValidationBody {
    availableValue: availableBodyValue = {
        category: ["nodejs", "angular", "javascript", "react"],
        categories: ["nodejs", "angular", "javascript", "react"],
        level: ["junior", "middle", "senior"],
        language: ["english", "ukrainian", "russian"]
    }

    arrFieldBody: string[] = ['language', 'categories'];
    numberFieldBody: string[] = ['salary', 'id_user'];

    checkValidBody(body: positionCreateBody | positionUpdateBody | applicantCreateBody | applicantUpdateBody): boolean {
        for(const key in body) {
            if(!body[key]) {
                return false;
            }
            else if(this.arrFieldBody.includes(key)) {
                for(const elem of body[key]) {
                    if(!this.availableValue[key].includes(elem.toLowerCase())) {
                        return false;
                    }
                }
                continue;
            }
            else if(this.numberFieldBody.includes(key)) {
                if(typeof(body[key]) !== 'number')  return false;
                else {
                    if(body[key] <= 0) return false;
                }
            }
            else {
                if(this.availableValue[key] && !this.availableValue[key].includes(body[key].toLowerCase())) return false;
            }
        }
        return true;
    }
}

@Injectable()
export class HelperPosApp {
    async prepareQuery(query: getAllPosQuery): Promise<getAllPosQuery> {
        const fields: getAllPosQuery = {}
        for(const key in query) {
            if(key === 'tag') {
                fields['description'] = Like(`%${query[key]}%`);
                continue;
            }
            fields[key] = query[key];
        }
        return fields;
    }

    async prepareBodyToAdd(body: positionUpdateBody | positionCreateBody) {
        const bodyToDB = {};
        const arrKey = ['language', 'categories'];
        for(const key in body) {
            if(arrKey.includes(key)) {
                bodyToDB[key] = body[key].join(',').toLowerCase();
                continue;
            }
            bodyToDB[key] = body[key];
        }
        return bodyToDB;
    }
}
