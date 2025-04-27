import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, Message } from '../../services/chat.service'; // Adjust path as needed
import { FormsModule } from '@angular/forms';

@Component({  
  selector: 'app-messages-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css',
})
export class MessagesListComponent implements OnInit {
  @Output() chatSelected = new EventEmitter<any>();
  activeChat?: number;
  chats: any[] = [];
  searchTerm = '';


  constructor(private chatService: ChatService) {}

  get filteredChats() {
    return this.chats.filter(chat =>
      chat.user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (token && !this.chatService.isSocketOpen()) {
      this.chatService.initWebSocket(token);
    } else if (!token) {
      console.error('Access token not found in localStorage');
    }
    this.loadChats();
    // Listen to new messages in real-time
    this.chatService.onNewMessage().subscribe((message: Message) => {
      this.updateChatPreview(message);
    });

    console.log('Navigation state:', history.state);

    // If you specifically want to access the chatWith property:
    if (history.state && history.state.chatWith) {
      console.log('Chat with consultant:', history.state.chatWith);
    }
  }

  loadChats() {
    this.chatService.getConversationList().subscribe({
      next: conversations => {
        console.log('Conversations:', conversations);
        this.chats = conversations.map(chat => ({
          id: chat.user_id,
          user: {
            name: chat.name,
            avatar: this.getRandomAvatar(chat.user_id), // fallback avatar
          },
          lastMessage: chat.last_message,
          time: this.formatTime(chat.last_message_time),
          isOnline: chat.is_online,
        }));

        if (history.state && history.state.chatWith) {
          const chatWith = history.state.chatWith;
          this.onChatSelect(chatWith);
        }
      },
      error: err => {
        console.error('Failed to load chats:', err);
      },
    });
  }

  onChatSelect(chat: any) {
    this.activeChat = chat.id;
    this.chatSelected.emit(chat);
  }

  formatTime(isoTime: string): string {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getRandomAvatar(seed: number): string {
    // Just for demo purposes — use a real avatar field if you have it
    return `https://randomuser.me/api/portraits/men/${seed % 100}.jpg`;
  }

  updateChatPreview(message: Message) {
    const chatIndex = this.chats.findIndex(
      chat => chat.id === message.sender_id || chat.id === message.receiver_id
    );
    if (chatIndex > -1) {
      const chat = this.chats[chatIndex];
      chat.lastMessage = message.message;
      chat.time = this.formatTime(
        message.created_at || new Date().toISOString()
      );
      // Move chat to the top of the list
      this.chats.splice(chatIndex, 1);
      this.chats.unshift(chat);
    } else {
      // Message from a new contact: update chats list
      this.loadChats();
    }
  }
}
