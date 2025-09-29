import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from './api.service';

export { LoginRequest, LoginResponse } from './api.service';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PasswordRecoveryRequest {
  email: string; // or whatever field your API expects
}

export interface PasswordRecoveryResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access-token';
  private readonly REFRESH_TOKEN_KEY = 'refresh-token';
  private readonly USER_KEY = 'user';

  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('AuthService: Login method called with credentials:', credentials);
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('AuthService: Login response received:', response);
          if (response.accessToken) {
            this.setTokens(response.accessToken, response.refreshToken);
            // Create a user object from the response
            const user = {
              firstName: response.firstName,
              grade: response.grade,
              role: response.role,
              socioImageUrl: response.socioImageUrl
            };
            this.setCurrentUser(user);
            console.log('AuthService: User authenticated and stored:', user);
          }
        })
      );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    console.log('AuthService: Refresh token method called');
    const refreshToken = this.getRefreshToken();
    console.log('AuthService: Current refresh token:', refreshToken);
    if (!refreshToken) {
      console.log('AuthService: No refresh token available');
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    console.log('AuthService: Refresh token request:', request);
    return this.http.post<RefreshTokenResponse>(`${this.baseUrl}/api/auth/refresh`, request)
      .pipe(
        tap(response => {
          console.log('AuthService: Refresh token response:', response);
          if (response.accessToken) {
            this.setTokens(response.accessToken, response.refreshToken);
            console.log('AuthService: Tokens updated after refresh');
          }
        }),
        catchError(error => {
          console.log('AuthService: Refresh token error:', error);
          // If refresh token fails, logout user
          if (error.status === 401 || error.status === 403) {
            this.logout();
          }
          return throwError(() => error);
        })
      );
  }

  recoverPassword(request: PasswordRecoveryRequest): Observable<PasswordRecoveryResponse> {
    console.log('AuthService: Password recovery method called with request:', request);
    return this.http.post<PasswordRecoveryResponse>(`${this.baseUrl}/api/auth/recovery`, request)
      .pipe(
        tap(response => {
          console.log('AuthService: Password recovery response:', response);
        })
      );
  }

  logout(): void {
    console.log('AuthService: Logout method called');
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    console.log('AuthService: Removed tokens from localStorage');
    this.currentUserSubject.next(null);
    console.log('AuthService: Updated current user subject');
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    console.log('AuthService: isAuthenticated called, token exists:', token !== null);
    return token !== null;
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    console.log('AuthService: getAccessToken called, token:', token);
    return token;
  }

  getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    console.log('AuthService: getRefreshToken called, refresh token:', refreshToken);
    return refreshToken;
  }

  private setTokens(accessToken: string, refreshToken?: string | null): void {
    console.log('AuthService: setTokens called with access token:', accessToken, 'and refresh token:', refreshToken);
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    console.log('AuthService: Access token stored in localStorage');
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      console.log('AuthService: Refresh token stored in localStorage');
    }
  }

  private setCurrentUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}