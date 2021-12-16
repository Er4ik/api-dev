export interface positionCreateBody {
	readonly category: string,
	readonly level: string,
	readonly company: string,
	readonly language?: string[],
	readonly description?: string,
	readonly salary: number,
	readonly id_user: number,
}

export interface positionUpdateBody {
	readonly category?: string,
	readonly level?: string,
	readonly company?: string,
	readonly language?: string[],
	readonly description?: string,
	readonly salary?: number,
}

type emailToSend = string;
type emailFromSend = string;
type title = string;
type messageBody = string;

export interface sendMail {
	readonly to: emailToSend,
	readonly from: emailFromSend,
	readonly subject: title,
	readonly text: messageBody,
}

export interface getAllPosQuery {
	readonly category?: string,
	readonly level?: string,
	readonly tag?: string,
	readonly salary?: number,
}
