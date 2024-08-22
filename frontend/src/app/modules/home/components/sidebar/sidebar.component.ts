import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { UserService } from '../../../auth/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  public chatRooms: any[] = [];
  public searchQuery: string = '';
  private userId: string  = '';

  constructor(private chatService: ChatService, private chatRoomService: ChatRoomService, private userService: UserService){}
  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.loadChatRooms();
  }

  public loadChatRooms(): void{
    this.chatService.getChatRooms(this.userId).subscribe(rooms=>{
      this.chatRooms = rooms;
    })
  }

  public selectRoom(room: any): void{
    console.log('selected room', room)
    this.chatRoomService.setRoomId(room.roomId);
    this.chatService.joinRoom(room.roomId, this.userId);
    console.log('Selected Room', room);
  }

}
