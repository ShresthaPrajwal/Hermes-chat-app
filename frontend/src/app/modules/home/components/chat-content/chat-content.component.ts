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
  public userId: string = '';

  @ViewChild('chatMessagesContainer') private chatMessagesContainer !: ElementRef;

  constructor(private chatService: ChatService, private chatRoomService: ChatRoomService, private userService: UserService) { }

  ngOnInit(): void {
    this.chatRoomService.roomId$.subscribe(roomId => {
      this.userId = this.userService.getUserId();
      this.roomId = roomId;
      if (this.roomId) {
        this.loadMessages();
      }
    })

    this.chatService.receiveMessage().subscribe((message) => {
      console.log('received message', message)
      this.messages.push(message);
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

  public loadMessages(): void {
    if (this.roomId) {
      this.chatService.getMessages(this.roomId).subscribe((messages: any[]) => {
        this.messages = messages.map(msg => msg);
        this.scrollToBottom();
        console.log('messages',this.messages);
      });
    }
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
