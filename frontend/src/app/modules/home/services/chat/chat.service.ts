import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = environment.baseUrl;
  constructor(private socket: Socket, private http: HttpClient) { }

  public joinRoom(roomId: string, userId: string): void {
    this.socket.emit('join room', { roomId, userId });
  }

  public getChatRooms(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/chat/rooms/${userId}`);
  }

  public sendMessage(roomId: string, message: string, userId: string): void {
    this.socket.emit('chat message', { roomId, message, userId });
  }

  public receiveMessage(): Observable<any> {
    return this.socket.fromEvent('message');
  }

  public getRooms(): Observable<any> {
    return this.socket.fromEvent('rooms');
  }

  public getMessages(roomId: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/chat/messages/${roomId}`)
  }
}

