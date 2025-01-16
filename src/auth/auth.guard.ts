import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { error } from 'console';
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
            throw new UnauthorizedException('You Must Login!');
        }

        const requestedUserId = parseInt(request.params.id, 10);

        try {
            const decoded = this.jwtService.verify(Header);
            request.user = decoded;

            if (requestedUserId && parseInt(decoded.userId, 10) !== requestedUserId) {
                throw new UnauthorizedException('You are not authorized to access this resource');
            }

            return true;
        }
        catch (error) {
            throw new UnauthorizedException('Invalid or Expired token,You Must Login!');
        }
    }
}