import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();

    // Clone the request and add the authorization header if token exists
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token might be expired, try to refresh it
          const refreshToken = this.authService.currentUserValue?.refreshToken;

          if (refreshToken) {
            // Attempt to refresh the token
            return this.authService.refreshToken().pipe(
              switchMap((response) => {
                if (response && response.token) {
                  // Retry the original request with the new token
                  const newRequest = request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${response.token}`
                    }
                  });
                  return next.handle(newRequest);
                } else {
                  // If refresh fails, redirect to login
                  this.logout();
                  return throwError(error);
                }
              }),
              catchError(() => {
                // If refresh fails, redirect to login
                this.logout();
                return throwError(error);
              })
            );
          } else {
            // No refresh token, redirect to login
            this.logout();
            return throwError(error);
          }
        } else if (error.status === 403) {
          // Forbidden - user does not have permission for this resource
          this.logout();
          return throwError(error);
        }
        return throwError(error);
      })
    );
  }

  private logout() {
    this.authService.logout();
    this.router.navigate(['/account/auth/signin']);
  }
}