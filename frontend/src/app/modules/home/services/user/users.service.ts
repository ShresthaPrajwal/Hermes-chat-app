import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = environment.baseUrl;
  constructor(private socket: Socket, private http: HttpClient) { }


  public getAllUsers(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/user/allusers`);
  }

  public updateProfilePicture(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.put<any>(`${this.baseUrl}/user/profile/${userId}/profile-picture`, formData);
  }
}
