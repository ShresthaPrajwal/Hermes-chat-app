import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  private roomIdSubject = new BehaviorSubject<string>('');
  public roomId$ = this.roomIdSubject.asObservable();

  private roomObjectIdSubject = new BehaviorSubject<string>('');
  public roomObjectId$ = this.roomObjectIdSubject.asObservable();

  constructor() { }

  public setRoomId(roomId: string): void {
    this.roomIdSubject.next(roomId);
  }

  public setRoomObjectId(roomObjectId: string): void {
    this.roomObjectIdSubject.next(roomObjectId);
  }
}
