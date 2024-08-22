import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { UserService } from '../../../auth/services/user.service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.scss']
})
export class ChatContentComponent implements OnInit, OnChanges {
  public messages: string[] = [];
  public currentMessage: string = '';
  private roomId: string = '';
  private userId: string = ''; 

  constructor(private chatService: ChatService, private chatRoomService: ChatRoomService, private userService: UserService) {}

  ngOnInit(): void {
    this.chatRoomService.roomId$.subscribe(roomId=>{
      this.userId = this.userService.getUserId();
      console.log('curret user', this.userId)
      this.roomId = roomId;
      console.log('Chat Room Id', roomId)
      if(this.roomId){
        this.loadMessages();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roomId'] && this.roomId) {
      this.loadMessages(); 
    }
  }

  loadMessages(): void {
    if (this.roomId) {
      this.chatService.getMessages(this.roomId).subscribe((messages: any[]) => {
        this.messages = messages.map(msg => msg.content); 
        console.log(this.messages);
      });
    }
  }

  sendMessage(): void {
    if (this.roomId) {
      this.chatService.sendMessage(this.roomId, this.currentMessage, this.userId);
      this.currentMessage = '';
      this.loadMessages();
    }
  }
}
