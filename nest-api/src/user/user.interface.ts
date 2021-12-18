export interface userCreateBody {
	readonly name: string,
	readonly password: string,
	readonly email: string,
	readonly photo: string,
}

export interface userUpdateBody {
	readonly name?: string,
	readonly password?: string,
	readonly email?: string,
	readonly photo?: string,
}

export interface userLoginBody {
	readonly email: string,
	readonly password: string,
}
