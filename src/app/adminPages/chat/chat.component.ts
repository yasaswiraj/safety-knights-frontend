import { Component, OnInit } from '@angular/core';
import { MessagesListComponent } from '../../components/messages-list/messages-list.component';
import { ChatBoxComponent } from '../../components/chat-box/chat-box.component';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [MessagesListComponent, ChatBoxComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  selectedChat: any;
  
  constructor(private chatService: ChatService) { }
  
  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (token && !this.chatService.isSocketOpen()) {
      this.chatService.initWebSocket(token);
    }
  }
  
  ngOnDestroy(): void {
    if (this.chatService.isSocketOpen()) {
      this.chatService.closeWebSocket();
    }
  }
  
  onChatSelected(chat: any) {
    this.selectedChat = chat;
  }
}
