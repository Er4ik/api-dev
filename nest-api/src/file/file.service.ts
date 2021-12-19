import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { existsSync, rmdir, writeFile } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
	async saveFile(pict: object): Promise<string> {
		try {
			const fileName = uuidv4() + '.jpg';
			const filePath = path.resolve(__dirname, '..', 'static', fileName.split('.')[0]);
			if (!existsSync(filePath)) {
				mkdir(filePath, { recursive: true });
			}
			writeFile(path.resolve(filePath, fileName), pict['buffer'], (err) => {
				if (err)
					throw new HttpException(
						`Error save photo -> ${err}`,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
			});
			return fileName;
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async removeFile(fileName: string): Promise<void> {
		try {
			const filePath = path.resolve(__dirname, '..', 'static', fileName.split('.')[0]);
			rmdir(filePath, { recursive: true }, (err) => {
				if (err)
					throw new HttpException(
						`Error remove photo -> ${err}`,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
			});
			return;
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}

	async updateFile(fileName: string, pict: object): Promise<void> {
		try {
			const filePath = path.resolve(__dirname, '..', 'static', fileName.split('.')[0]);
			rmdir(filePath, { recursive: true }, (err) => {
				if (err)
					throw new HttpException(
						`Error remove photo -> ${err}`,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
			});
			writeFile(path.resolve(filePath, fileName), pict['buffer'], (err) => {
				if (err)
					throw new HttpException(
						`Error save photo -> ${err}`,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
			});
			return;
		} catch (err) {
			throw new HttpException(err.message, err.status);
		}
	}
}
