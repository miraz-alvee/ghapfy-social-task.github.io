import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
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
        console.log(Header);

        if (!Header) {
            throw new UnauthorizedException('You Must Login!');
        }

        const requestedUserId = parseInt(request.params.id, 10);

        try {
            const decoded = this.jwtService.verify(Header);
           
            console.log('Decoded Token:', decoded);
            request.user = decoded;

            if (requestedUserId && parseInt(decoded.userId, 10) !== requestedUserId) {
                throw new UnauthorizedException('You are not authorized to access this resource');
            }

            return true;
        }
        catch (error) {
            console.error('Token verification failed:', error);
            throw new UnauthorizedException('Invalid or expired token. You must login!');
        }
    }
}