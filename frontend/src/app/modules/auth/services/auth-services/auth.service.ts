import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  public loginUser(userName: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/login`;
    const body = {
      username: userName,
      password: password
    };
    return this.http.post(url, body);
  }

  public registerUser(username: string, email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/register`;
    const body = {
      username: username,
      email: email,
      password: password,
    };
    return this.http.post(url, body);
  }
}
