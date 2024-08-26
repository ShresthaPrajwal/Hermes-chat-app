import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdSubject = new BehaviorSubject<string | null>(null);
  public userId$ = this.userIdSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();


  constructor() {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');

    if (storedUserId) {
      this.userIdSubject.next(storedUserId);
    }
    if (storedUsername) {
      this.usernameSubject.next(storedUsername);
    }
  }

  public setUserData(userData: { userId: string; username: string; token: string }): void {
    this.userIdSubject.next(userData.userId);
    this.usernameSubject.next(userData.username);

    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('token', userData.token);
  }

  public getUserId(): string {
    return this.userIdSubject.value ? this.userIdSubject.value : '';
  }

  public getUsername(): string {
    return this.usernameSubject.value ? this.usernameSubject.value : '';
  }

  public getToken(): string {
    return localStorage.getItem('token') || '';
  }

  public clearUserData(): void {
    this.userIdSubject.next(null);
    this.usernameSubject.next(null);

    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }

}
