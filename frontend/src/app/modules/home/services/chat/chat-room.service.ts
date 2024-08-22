import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  private roomIdSubject = new BehaviorSubject<string>('');
  public roomId$ = this.roomIdSubject.asObservable();

  constructor() { }

  public setRoomId(roomId: string): void{
    this.roomIdSubject.next(roomId);
  }
}
