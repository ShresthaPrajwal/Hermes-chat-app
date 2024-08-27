import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private baseUrl = environment.baseUrl;
  constructor(private socket: Socket, private http: HttpClient) { }


  public sendFriendRequest(senderId: string, receiverId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/friend/friendRequest`, { senderId, receiverId });
  }

  public acceptFriendRequest(requestId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/friend/acceptRequest`, { requestId });
  }

  public rejectFriendRequest(requestId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/friend/rejectRequest`, { requestId });
  }

  public fetchFriendRequests(userId: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/friend/getFriendRequests/${userId}`);
  }
}
