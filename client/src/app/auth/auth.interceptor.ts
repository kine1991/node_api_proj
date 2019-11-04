import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('interceptor', req)
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });
        console.log('interceptor', authRequest)
        return next.handle(authRequest);
    }
}