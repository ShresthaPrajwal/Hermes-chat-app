import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { UserService } from '../../../auth/services/user.service';
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
  public groupedMessages: any ={};

  @ViewChild('chatMessagesContainer') private chatMessagesContainer !: ElementRef;

  constructor(
    private chatService: ChatService,
    private chatRoomService: ChatRoomService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.chatRoomService.roomId$.subscribe(roomId => {
      this.userId = this.userService.getUserId();
      this.roomId = roomId;
      console.log('Current room Id',this.roomId )
      if (this.roomId) {
        this.loadMessages();
      }
    })

    this.chatRoomService.roomObjectId$.subscribe(roomObjectId=>{
      this.roomObjectId = roomObjectId;
      this.updateRoomInfo();
      console.log('Current room Object Id', this.roomObjectId)
    })

    this.chatService.receiveMessage().subscribe((message) => {
      console.log('message aira cha',message)
      this.messages.push(message);
      this.loadMessages();
    })

    this.chatService.getRoomInfo(this.roomId).subscribe((roomInfo)=>{
      console.log('roominfo',roomInfo)
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
    this.chatService.getRoomInfo(this.roomObjectId).subscribe((roomInfo)=>{
      this.chatTitle = roomInfo.name;
      this.users = roomInfo.users;
    })
  }

  public loadMessages(): void {
    if (this.roomId) {
      this.chatService.getMessages(this.roomId).subscribe((messages: any[]) => {
        this.messages = messages
          .filter(msg => msg.senderId !== null)
          .map(msg => {
            return {
              ...msg,
              date: new Date(msg.timestamp).toDateString(), // Extract the date
            };
          });

          this.groupedMessages = this.groupMessagesByDate(this.messages);
        this.scrollToBottom();
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
