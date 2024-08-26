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

  private profilePictureSubject = new BehaviorSubject<string | null>(null);
  public profilePicture$ = this.profilePictureSubject.asObservable();

  private emailSubject = new BehaviorSubject<string | null>(null);
  public email$ = this.emailSubject.asObservable();

  private friendsSubject = new BehaviorSubject<string[] | null>(null);
  public friends$ = this.friendsSubject.asObservable();

  constructor() {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedProfilePicture = localStorage.getItem('profilePicture');
    const storedEmail = localStorage.getItem('email');

    if (storedUserId) {
      this.userIdSubject.next(storedUserId);
    }
    if (storedUsername) {
      this.usernameSubject.next(storedUsername);
    }
    if (storedProfilePicture) {
      this.profilePictureSubject.next(storedProfilePicture);
    }
    if (storedEmail) {
      this.emailSubject.next(storedEmail);
    }
  }

  public setUserData(userData: {
    userId: string;
    username: string;
    token: string;
    profilePicture: string;
    email: string;
  }): void {
    this.userIdSubject.next(userData.userId);
    this.usernameSubject.next(userData.username);
    this.profilePictureSubject.next(userData.profilePicture);
    this.emailSubject.next(userData.email);

    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('profilePicture', userData.profilePicture);
    localStorage.setItem('email', userData.email);
  }

  public getUserId(): string {
    return this.userIdSubject.value || '';
  }

  public getUsername(): string {
    return this.usernameSubject.value || '';
  }

  public getProfilePicture(): string {
    return this.profilePictureSubject.value || '';
  }

  public getEmail(): string {
    return this.emailSubject.value || '';
  }

  public getFriends(): string[] {
    return this.friendsSubject.value || [];
  }

  public getToken(): string {
    return localStorage.getItem('token') || '';
  }

  public clearUserData(): void {
    this.userIdSubject.next(null);
    this.usernameSubject.next(null);
    this.profilePictureSubject.next(null);
    this.emailSubject.next(null);
    this.friendsSubject.next(null);

    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('profilePicture');
    localStorage.removeItem('email');
  }
}
