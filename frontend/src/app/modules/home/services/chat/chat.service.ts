import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, ObservableLike } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = environment.baseUrl;
  constructor(private socket: Socket, private http: HttpClient) { }

  public joinRoom(roomId: string, userId: string): void {
    console.log('Joining with ', roomId, userId)
    this.socket.emit('join room', { roomId, userId });
  }

  public getChatRooms(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/chat/rooms/${userId}`);
  }

  public sendMessage(roomId: string, message: string, userId: string): void {
    this.socket.emit('chat message', { roomId, message, userId });
  }

  public receiveMessage(): Observable<any> {
    return this.socket.fromEvent('chat message');
  }

  public getRooms(): Observable<any> {
    return this.socket.fromEvent('rooms');
  }

  public getMessages(roomId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/chat/messages/${roomId}`)
  }

  public getAllChatRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/chat/allrooms`);
  }

  public addGroupMember(roomId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/chat/addgroupmembers/${roomId}`, { userIds: [userId] });
  }

  public removeGroupMember(roomId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/chat/removegroupmember/${roomId}`, { userId });
  }

  public createGroup(name: string, userIds: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat/creategroup`, { name, userIds });
  }

  public getRoomInfo(roomId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/chat/getroominfo/${roomId}`);
  }

  public sendImage(roomId: string, userId: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('chatRoomId', roomId);
    formData.append('senderId', userId);

    return this.http.post(`${this.baseUrl}/chat/sendmessagewithimage`, formData);
  }

  public sendImageNotification(roomId: string, imageUrlmessageId: string, userId: string): void {
    this.socket.emit('chat message', { roomId, imageUrlmessageId, userId });
  }
}

