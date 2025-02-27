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
  public friendRequests: any[] = [];
  public sentFriendRequests: string[] = [];

  public groupModalVisible: boolean = false;
  public groupName: string = '';
  public selectedFriends: any[] = [];

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
    this.sentFriendRequests = this.userService.getFriendRequestsSent();
    if (this.selectedTab === 'chats') {
      this.chatService.getChatRooms(this.userService.getUserId()).subscribe((rooms) => {
        this.chatRooms = rooms;
        if (!(window.innerWidth <= 768)) {
          if (this.chatRooms.length > 0) {
            this.selectRoom(this.chatRooms[0]);
          }
        }

      });
    }
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
        const friendIds = this.friends.map(friend => friend.userId);
        const friendRequestsIds = this.userService.getFriendRequests();

        this.allUsers = users.filter(user => !this.friends.includes(user.userId) && user.userId !== currentUserId);
        this.friendRequests = users.filter(user => friendRequestsIds.includes(user.userId));

        this.allUsers = users.filter(user =>
          !friendIds.includes(user.userId) && user.userId !== currentUserId
        );
      });
    }

    if (this.selectedTab === 'requests') {
      this.friendService.fetchFriendRequests(this.userService.getUserId()).subscribe(
        requests => {
          this.friendRequests = requests.friendRequests;
        }
      )
    }
  }

  public selectRoom(room: any): void {
    this.chatRoomService.setRoomId(room.roomId);
    this.chatRoomService.setRoomObjectId(room._id);
    this.chatService.joinRoom(room.roomId, this.userService.getUserId());

    if (window.innerWidth <= 768) {
      const chatContentElement = document.querySelector('app-chat-content');
      const chatsidenav = document.querySelector('app-sidenav');
      const chatsidebar = document.querySelector('app-sidebar');

      if (chatContentElement) {
        chatContentElement.classList.add('active');
      }
      if (chatsidebar) {
        chatsidebar.classList.add('inactive');
      }
      if (chatsidenav) {
        chatsidenav.classList.add('inactive');
      }
    }
  }

  public openGroupCreationModal(): void {
    this.groupModalVisible = true;
  }
  public onFriendSelection(event: any, friend: any): void {
    if (event.target.checked) {
      this.selectedFriends.push(friend);
    } else {
      this.selectedFriends = this.selectedFriends.filter(f => f.userId !== friend.userId);
    }
  }
  public createGroup(): void {
    const selectedFriendIds = this.selectedFriends.map(friend => friend.userId);
    const userId = this.userService.getUserId();

    selectedFriendIds.push(userId);

    this.chatService.createGroup(this.groupName, selectedFriendIds).subscribe(() => {
      this.groupModalVisible = false;
      this.groupName = '';
      this.selectedFriends = [];
      this.loadChatRooms();
    });
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

  public acceptFriendRequest(requestId: string): void {
    this.friendService.acceptFriendRequest(requestId).subscribe((acceptResponse) => {
      this.userService.acceptFriendRequest(acceptResponse.sender.id);
      this.refreshFriendRequests();
    });
  }

  public declineFriendRequest(requestId: string): void {
    this.friendService.rejectFriendRequest(requestId).subscribe((rejectResponse) => {
      this.userService.declineFriendRequest(rejectResponse.sender.id);
      this.refreshFriendRequests();
    });
  }

  public refreshFriendRequests(): void {
    this.friendService.fetchFriendRequests(this.userService.getUserId()).subscribe(requests => {
      this.friendRequests = requests.friendRequests;
    });
  }

  public hasSentRequest(userId: string): boolean {
    return this.userService.isFriendRequestSent(userId);
  }

  public getFilteredChatRooms(): any[] {
    return this.chatRooms.filter(room =>
      room.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  public getFilteredAllChatRooms(): any[] {
    return this.allChatRooms.filter(room =>
      room.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  public getFilteredAllUsers(): any[] {
    return this.allUsers.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  public getFilteredFriendRequests(): any[] {
    return this.friendRequests.filter(request =>
      request.sender.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
