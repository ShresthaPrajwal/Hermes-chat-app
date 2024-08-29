import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { UserService } from '../../../auth/services/user.service';
import { ThemeService } from '../../../../shared/services/theme/theme.service';
@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.scss']
})
export class ChatContentComponent implements OnInit, OnChanges, AfterViewInit {
  public messages: any[] = [];
  public currentMessage: string = '';
  public roomId: string = '';
  public roomObjectId: string = '';
  public userId: string = '';
  public chatTitle: string = '';
  public users: any[] = [];
  public groupedMessages: any = {};
  public selectedImage: File | null = null;

  public showBackButton: boolean = false;
  public isDarkMode: boolean = false;

  public loading : boolean = true;

  @ViewChild('chatMessagesContainer') private chatMessagesContainer !: ElementRef;

  constructor(
    private chatService: ChatService,
    private chatRoomService: ChatRoomService,
    private userService: UserService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {

    this.isDarkMode = this.themeService.isDarkMode();

    this.themeService.themeChanged.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.chatRoomService.roomId$.subscribe(roomId => {
      this.userId = this.userService.getUserId();
      this.roomId = roomId;
      console.log('Current room Id', this.roomId)
      if (this.roomId) {
        this.loadMessages();
        this.showBackButton = window.innerWidth <= 768;
      }
    })

    this.chatRoomService.roomObjectId$.subscribe(roomObjectId => {
      this.roomObjectId = roomObjectId;
      this.updateRoomInfo();
      console.log('Current room Object Id', this.roomObjectId)
    })

    this.chatService.receiveMessage().subscribe((message) => {
      console.log('message aira cha', message)
      this.messages.push(message);
      this.loadMessages();
    })

    this.chatService.getRoomInfo(this.roomId).subscribe((roomInfo) => {
      console.log('roominfo', roomInfo)
      this.chatTitle = roomInfo.name;
      this.users = roomInfo.users;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roomId'] && this.roomId) {
      this.loadMessages();
      this.scrollToBottom();
    }
  }

  ngAfterViewInit(): void {
  }

  private updateRoomInfo(): void {
    this.chatService.getRoomInfo(this.roomObjectId).subscribe((roomInfo) => {
      this.chatTitle = roomInfo.name;
      this.users = roomInfo.users;
    })
  }

  public loadMessages(): void {
    if (this.roomId) {
      this.loading = true;
      this.chatService.getMessages(this.roomId).subscribe((messages: any[]) => {
        this.messages = messages
          .filter(msg => msg.senderId !== null)
          .map(msg => {
            return {
              ...msg,
              date: new Date(msg.timestamp).toDateString(),
            };
          });
  
        this.groupedMessages = this.groupMessagesByDate(this.messages);
        this.scrollToBottom();
        this.loading = false;
      });
    }
  }
  

  private groupMessagesByDate(messages: any[]): { date: string, messages: any[] }[] {
    const grouped = messages.reduce((acc, message) => {
      const date = message.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {} as { [key: string]: any[] });

    return Object.keys(grouped).map(date => ({
      date,
      messages: grouped[date],
    }));
  }

  public sendMessage(): void {
    if (this.roomId) {
      this.chatService.sendMessage(this.roomId, this.currentMessage, this.userId);
      this.currentMessage = '';
      this.scrollToBottom();
    }
  }

  public goBack(): void {
    console.log('gack')
    if (window.innerWidth <= 768) {
      const chatContentElement = document.querySelector('app-chat-content');
      const chatsidenav = document.querySelector('app-sidenav');
      const chatsidebar = document.querySelector('app-sidebar');
      console.log(chatContentElement, chatsidebar, chatsidebar)
      if (chatContentElement) {
        chatContentElement.classList.replace('active', 'inactive');
      }
      if (chatsidebar) {
        chatsidebar.classList.replace('inactive', 'active');
      }
      if (chatsidenav) {
        chatsidenav.classList.replace('inactive', 'active');
      }

    }
  }

  public onImageSelected(files: FileList | null): void {
    if (files && files.length > 0) {
      this.selectedImage = files.item(0);
    } else {
      this.selectedImage = null;
    }
  }

  public sendImage(): void {
    console.log('roomid<roomobj id', this.roomId, this.roomObjectId);
    if (this.selectedImage) {
      this.chatService.sendImage(this.roomObjectId, this.userId, this.selectedImage).subscribe(response => {
        console.log('response while sending image ',response)
        if (response && response.message._id) {
          this.chatService.sendImageNotification(this.roomId, response.message._id, this.userId);
        }
      });

      this.selectedImage = null;
    }
  }
  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.chatMessagesContainer.nativeElement;
      container.scroll({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }, 500);
  }
}
