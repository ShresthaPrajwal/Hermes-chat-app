import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { UserService } from '../../../auth/services/user.service';
import { TabService } from '../../services/tab/tab.service';
import { UsersService } from '../../services/user/users.service';
import { FriendService } from '../../services/friend/friend.service';

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
  public allUsers: any[] = [];
  public friends: any[] = [];
  public friendRequests: string[] = [];
  public sentFriendRequests: string[] = []; 

  constructor(
    private chatService: ChatService,
    private chatRoomService: ChatRoomService,
    private userService: UserService,
    private tabService: TabService,
    private usersService: UsersService,
    private friendService: FriendService
  ) { }

  ngOnInit(): void {
    this.tabService.selectedTab$.subscribe(tab => {
      this.selectedTab = tab;
      this.loadChatRooms();
    });

    this.friends = this.userService.getFriends();
    this.sentFriendRequests = this.userService.getFriendRequestsSent(); // Load sent friend requests

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

    if (this.selectedTab === 'peoples') {
      this.usersService.getAllUsers().subscribe(users => {
        const currentUserId = this.userService.getUserId();
        const friendRequestsIds = this.userService.getFriendRequests();
        this.allUsers = users.filter(user => !this.friends.includes(user.userId) && user.userId !== currentUserId);
        this.friendRequests = users.filter(user => friendRequestsIds.includes(user.userId));
      });
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

  public addFriend(user: any): void {
    const senderId = this.userService.getUserId();
    const receiverId = user.userId;

    if (!this.userService.isFriendRequestSent(receiverId)) {
      this.friendService.sendFriendRequest(senderId, receiverId).subscribe(() => {
        this.userService.addFriendRequestSent(receiverId);
        this.sentFriendRequests.push(receiverId);
      });
    }
  }

  public acceptFriendRequest(userId: string): void {
    this.userService.acceptFriendRequest(userId);
    this.friendRequests = this.userService.getFriendRequests(); 
  }

  public declineFriendRequest(userId: string): void {
    this.userService.declineFriendRequest(userId);
    this.friendRequests = this.userService.getFriendRequests(); 
  }

  public hasSentRequest(userId: string): boolean {
    return this.userService.isFriendRequestSent(userId);
  }
}
