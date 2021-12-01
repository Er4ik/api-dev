export class CreatePosBodyDto {
    readonly category: string;
    readonly level: string;
    readonly company: string;
    readonly language?: string[];
    readonly description?: string;
    readonly salary: number;
    readonly id_user: number
}