import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { UserService } from '../../../auth/services/user.service';
import { ThemeService } from '../../../../shared/services/theme/theme.service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.scss']
})
export class ChatContentComponent implements OnInit, OnChanges {
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
  public loading: boolean = true;

  @ViewChild('chatMessagesContainer') private chatMessagesContainer!: ElementRef;

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
      if (this.roomId) {
        this.loadMessages();
        this.showBackButton = window.innerWidth <= 768;
      }
    });

    this.chatRoomService.roomObjectId$.subscribe(roomObjectId => {
      this.roomObjectId = roomObjectId;
      this.updateRoomInfo();
    });

    this.chatService.receiveMessage().subscribe(message => {
      this.messages.push(message);
      this.groupedMessages = this.groupMessagesByDate(this.messages);
      this.scrollToBottom();
    });

    this.chatService.getRoomInfo(this.roomId).subscribe(roomInfo => {
      this.chatTitle = roomInfo.name;
      this.users = roomInfo.users;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roomId'] && this.roomId) {
      this.loadMessages();
    }
  }

  private updateRoomInfo(): void {
    this.chatService.getRoomInfo(this.roomObjectId).subscribe(roomInfo => {
      this.chatTitle = roomInfo.name;
      this.users = roomInfo.users;
    });
  }

  public loadMessages(): void {
    if (this.roomId) {
      this.loading = true;
      this.chatService.getMessages(this.roomId).subscribe((messages: any[]) => {
        this.messages = messages
          .filter(msg => msg.senderId !== null)
          .map(msg => ({
            ...msg,
            date: new Date(msg.timestamp).toDateString(),
          }));

        this.groupedMessages = this.groupMessagesByDate(this.messages);
        this.scrollToBottom();
        this.loading = false;
      });
    }
  }

  private groupMessagesByDate(messages: any[]): { date: string, messages: any[] }[] {
    const grouped = messages.reduce((acc, message) => {
      const date = this.formatDate(new Date(message.timestamp));
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

  private formatDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toDateString();
    }
  }

  public sendMessage(): void {
    if (this.roomId && this.currentMessage.trim()) {
      this.chatService.sendMessage(this.roomId, this.currentMessage, this.userId);
      this.currentMessage = '';
      this.scrollToBottom();
    }
  }

  public goBack(): void {
    if (window.innerWidth <= 768) {
      const chatContentElement = document.querySelector('app-chat-content');
      const chatsidenav = document.querySelector('app-sidenav');
      const chatsidebar = document.querySelector('app-sidebar');
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
    if (this.selectedImage) {
      this.chatService.sendImage(this.roomObjectId, this.userId, this.selectedImage).subscribe(response => {
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
