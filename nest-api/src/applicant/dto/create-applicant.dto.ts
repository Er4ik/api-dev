export class CreateApplicantDto {
    readonly level: string;
    readonly language?: string[];
    readonly categories: string[];
    readonly salary: number;
    readonly id_user: number;
}