import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { UserService } from '../../../auth/services/user.service';
import { TabService } from '../../services/tab/tab.service';
import { UsersService } from '../../services/user/users.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public chatRooms: any[] = [];
  public allChatRooms: any[] = [];
  public searchQuery: string = '';
  public selectedTab: string = '';
  public allUsers: any[] =[];
  public friends: any[]= [];

  constructor(
    private chatService: ChatService,
    private chatRoomService: ChatRoomService,
    private userService: UserService,
    private tabService: TabService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {

    this.tabService.selectedTab$.subscribe(tab => {
      this.selectedTab = tab;
      this.loadChatRooms();
    });

    this.friends = this.userService.getFriends();
    console.log('Friends',this.friends)

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
        this.allChatRooms = rooms;
      });
    }

    if(this.selectedTab === 'peoples') {
      this.usersService.getAllUsers().subscribe(users=>{
      const currentUserId = this.userService.getUserId();
        this.allUsers = users.filter(user=> !this.friends.includes(user.userId) && user.id!==currentUserId);
      })
    }
  }

  public selectRoom(room: any): void {
    this.chatRoomService.setRoomId(room.roomId);
    this.chatService.joinRoom(room.roomId, this.userService.getUserId());
  }

  public joinGroup(room: any): void {
    this.chatService.addGroupMember(room.roomId, this.userService.getUserId()).subscribe(() => {
      this.loadChatRooms(); 
    });
  }

  public leaveGroup(room: any): void {
    this.chatService.removeGroupMember(room.roomId, this.userService.getUserId()).subscribe(() => {
      this.loadChatRooms(); 
    });
  }

  public isUserInRoom(room: any): boolean {
    return room.users.includes(this.userService.getUserId());
  }

  public addFriend(user: any):void{

  }
}
