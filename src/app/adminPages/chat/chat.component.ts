import { Component } from '@angular/core';
import { MessagesListComponent } from '../../components/messages-list/messages-list.component';
import { ChatBoxComponent } from '../../components/chat-box/chat-box.component';

@Component({
  selector: 'app-chat',
  imports: [MessagesListComponent, ChatBoxComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  selectedChat: any;

  onChatSelected(chat: any) {
    this.selectedChat = chat;
  }
}
