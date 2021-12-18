import { User } from 'src/user/user.entity';

export interface availableBodyValue {
	readonly category: string[];
	readonly categories: string[];
	readonly level: string[];
	readonly language: string[];
}

export interface verifyDataToken {
	readonly name: string;
	readonly email: string;
}

export interface userAndBody {
	readonly user: User;
	readonly bodyToDB: object;
}
