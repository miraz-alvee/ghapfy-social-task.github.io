import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const Header = request.headers.authorization?.replace('Bearer ', '');

        if (!Header) {
            return false;
        }

        const requestedUserId = parseInt(request.params.id, 10);

        try {
            //const token = Header.split(' ')[1];
            //console.log("success");
            const decoded = this.jwtService.verify(Header);
            request.user = decoded;

            if (requestedUserId && parseInt(decoded.userId, 10) !== requestedUserId) {
                return false;
            }

            return true;
        }
        catch (error) {
            return false;
        }
    }
}