import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports:[CommonModule],
  selector: 'app-chat-skeleton',
  templateUrl: './chat-skeleton.component.html',
  styleUrl: './chat-skeleton.component.scss',
  standalone: true
})
export class ChatSkeletonComponent {
  @Input() isCurrentUser: boolean = false;
}
