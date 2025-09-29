import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Updated import path
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor: Intercept method called for URL:', req.url);
    // Add auth header if the user is logged in and the request is to our API
    const token = this.authService.getAccessToken();
    const isLoggedIn = this.authService.isAuthenticated();
    const isApiUrl = req.url.startsWith(environment.apiBaseUrl); // Use the environment API base URL
    
    console.log('AuthInterceptor: Token exists:', !!token);
    console.log('AuthInterceptor: User is logged in:', isLoggedIn);
    console.log('AuthInterceptor: Is API URL:', isApiUrl);
    
    if (isLoggedIn && isApiUrl && token) {
      console.log('AuthInterceptor: Adding auth header to request');
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log('AuthInterceptor: Not adding auth header');
    }

    return next.handle(req);
  }
}