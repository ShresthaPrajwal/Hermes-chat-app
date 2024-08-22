import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  public chatRooms: any[] = [];
  public searchQuery: string = '';
  private userId: string = '66c4113dd3e3e8210402a6c6';

  constructor(private chatService: ChatService, private chatRoomService: ChatRoomService){}
  ngOnInit(): void {
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
    this.chatService.joinRoom(room.name, this.userId);
    console.log('Selected Room', room);
  }

}
