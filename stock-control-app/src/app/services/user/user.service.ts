import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { SinupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SinupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient, private cookie: CookieService) { }

  public signUpUser(requestData: SinupUserRequest): Observable<SinupUserResponse> {
    return this.http.post<SinupUserResponse>(`${this.API_URL}/user`, requestData);
  }

  public authUser(requestDatas: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas);
  }

  public isLoggedIn(): boolean {
    // Verificar se o usuário possui um token ou cookie.
    const JWT_TOKEN = this.cookie.get('USER_INFO');

    return JWT_TOKEN ? true : false;
  }

  public handleLogout(): void {
    this.cookie.delete('USER_INFO');
  }
}
