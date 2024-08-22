import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdSubject = new BehaviorSubject<string | null>(null);
  public userId$ = this.userIdSubject.asObservable();
  constructor() { }

  public setUserId(userId: string): void {
    this.userIdSubject.next(userId);
  }

  public getUserId(): string {
    return this.userIdSubject.value ? this.userIdSubject.value : '';
  }

}
