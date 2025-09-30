import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Updated import path
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor: Intercept method called for URL:', req.url);
    // Add auth header if the user is logged in and the request is to our API
    const token = this.authService.getAccessToken();
    const isLoggedIn = this.authService.isAuthenticated();
    
    // Check if the request URL matches our API (both absolute and relative)
    const isApiUrl = req.url.startsWith(environment.apiBaseUrl) || req.url.startsWith('/api/');
    
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

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('AuthInterceptor: HTTP error caught:', error);
        // If the error is a 401 or 403 (unauthorized/forbidden), logout the user
        if (error.status === 401 || error.status === 403) {
          console.log('AuthInterceptor: Unauthorized or forbidden error, clearing tokens and redirecting to login');
          this.authService.logout();
          this.router.navigate(['/account/auth/signin']);
        }
        return throwError(() => error);
      })
    );
  }
}