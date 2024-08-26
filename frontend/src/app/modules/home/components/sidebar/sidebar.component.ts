import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { UserService } from '../../../auth/services/user.service';
import { TabService } from '../../services/tab/tab.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public chatRooms: any[] = [];
  public searchQuery: string = '';
  public selectedTab: string = '';

  constructor(
    private chatService: ChatService,
    private chatRoomService: ChatRoomService,
    private userService: UserService,
    private tabService: TabService
  ) { }

  ngOnInit(): void {
    this.tabService.selectedTab$.subscribe(tab => {
      this.selectedTab = tab;
      this.loadChatRooms();
    });

    this.loadChatRooms();
  }

  public loadChatRooms(): void {
    if (this.selectedTab === 'chats') {
      this.chatService.getChatRooms(this.userService.getUserId()).subscribe((rooms) => {
        this.chatRooms = rooms;
      });
    }
    if (this.selectedTab === 'groups') {
      this.chatService.getAllChatRooms().subscribe((rooms) => {
        this.chatRooms = rooms;
      })
    }
  }

  public selectRoom(room: any): void {
    this.chatRoomService.setRoomId(room.roomId);
    this.chatService.joinRoom(room.roomId, this.userService.getUserId());
  }
}
