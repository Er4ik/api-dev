import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthService implements CanActivate {
    constructor() {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0].toLowerCase()
            const token = authHeader.split(' ')[1]
            
            if (bearer !== 'bearer' || !token) {
                throw new UnauthorizedException({message: `User doesn't authorized`})
            }
            return true;
        } catch (e) {
            throw new UnauthorizedException({message: `User doesn't authorized`})
        }
    }
}