import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  ownerId: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  accountStatus:      string;
  trialDaysRemaining: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'loriview_token';
  private readonly USER_KEY  = 'loriview_user';
  private readonly API       = environment.apiUrl;

  private currentUserSubject =
    new BehaviorSubject<AuthResponse | null>(this.getStoredUser());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(
    `${this.API}/auth/login`,
    { email, password }
  ).pipe(
    tap(response => {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response));
      this.currentUserSubject.next(response);
    })
  );
}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API}/auth/register`, request
    ).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
  return localStorage.getItem(this.TOKEN_KEY);
}

  isLoggedIn(): boolean {
  return !!localStorage.getItem(this.TOKEN_KEY);
}

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  getOwnerId(): number | null {
    return this.getCurrentUser()?.ownerId ?? null;
  }

  isAdmin(): boolean {
  return this.getCurrentUser()?.role === 'SUPER_ADMIN';
}

getRole(): string {
  return this.getCurrentUser()?.role || 'OWNER';
}

  private getStoredUser(): AuthResponse | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  getProfile(): Observable<AuthResponse> {
  return this.http.get<AuthResponse>(`${this.API}/auth/profile`);
}

updateProfile(data: {
  fullName?: string;
  phone?:    string;
  password?: string;
}): Observable<AuthResponse> {
  return this.http.put<AuthResponse>(
    `${this.API}/auth/profile`, data
  ).pipe(
    tap(response => {
      // Update stored user info
      const current = this.getCurrentUser();
      if (current) {
        const updated = { ...current, ...response };
        localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this.currentUserSubject.next(updated);
      }
    })
  );
}
}