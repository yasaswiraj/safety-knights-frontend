import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from '../../services/chat.service';
import { log } from 'console';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css',
})
export class ChatBoxComponent implements OnInit, OnChanges {
  @Input() selectedChat: any;
  chatUser = { name: '', avatar: '' };
  messages: any[] = [];
  messageText: string = '';
  currentUserId: number = 0;
  socketReady: boolean = false;  // <-- New property
  private isTryingToSend = false;  // <-- New flag

  constructor(private chatService: ChatService) {
    // Subscribe to connection established event to set current user id
    this.chatService.onConnectionEstablished().subscribe(userId => {
      this.currentUserId = userId;
    });
    // Subscribe to new messages from ChatService
    this.chatService.onNewMessage().subscribe((msg: Message) => {
      const otherId = this.selectedChat?.id;  // Use selectedChat.id
      if (this.selectedChat && (msg.sender_id === otherId || msg.receiver_id === otherId)) {
        this.messages.unshift(this.formatMessage(msg));
      }
    });
  }

  ngOnInit(): void {
    // Wait until the WebSocket connection is established
    console.log('Initializing chat box');
    this.chatService.onConnectionEstablished().subscribe(() => {
      this.socketReady = true;
      console.log('WebSocket is ready ✅');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', this.selectedChat);
    if (changes['selectedChat'] && this.selectedChat) {
      this.chatUser = {
        name: this.selectedChat.user.name,
        avatar: this.selectedChat.user.avatar,
      };
      // Use selectedChat.id for loading messages
      const otherUserId = this.selectedChat.id;
      if (otherUserId != null) {
        this.loadMessages(otherUserId);
      } else {
        console.error("Selected chat's user id is undefined");
      }
    }
  }

  loadMessages(otherUserId: number): void {
    this.chatService.getConversation(otherUserId).subscribe({
      next: (data: Message[]) => {
        console.log('Messages:', data);
        this.messages = data.map(m => this.formatMessage(m)).reverse();
      },
      error: err => {
        console.error('Failed to load messages:', err);
      }
    });
  }

  formatMessage(msg: Message): any {
    return {
      id: msg.chat_id,
      sender: msg.sender_id === this.currentUserId ? 'You' : this.chatUser.name,
      message: msg.message,
      time: this.formatTime(msg.created_at),
      isMe: !(msg.receiver_id === this.currentUserId)
    };
  }

  formatTime(iso?: string): string {
    return iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  }

  sendMessage(): void {
    if (!this.socketReady || this.isTryingToSend) {
      console.warn('Waiting for WebSocket to open...');
      return;
    }
    if (!this.messageText.trim() || !this.selectedChat) return;

    const message: Message = {
      sender_id: this.currentUserId,
      receiver_id: this.selectedChat.id,
      message: this.messageText
    };

    const trySend = () => {
      if (this.chatService.isSocketOpen()) {
        this.chatService.sendWebSocketMessage(message);
        this.messages.unshift({
          id: Date.now(),
          sender: 'You',
          message: message.message,
          time: this.formatTime(new Date().toISOString()),
          isMe: true
        });
        this.messageText = '';
        this.isTryingToSend = false;  // Reset the flag
      } else {
        this.isTryingToSend = true;
        console.warn('Waiting for WebSocket to open...');
        setTimeout(trySend, 500);
      }
    };

    trySend();
  }
}
