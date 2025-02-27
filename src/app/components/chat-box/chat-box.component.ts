import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-box',
  imports: [CommonModule],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css',
})
export class ChatBoxComponent implements OnChanges {
  @Input() selectedChat: any;
  chatUser = {
    name: '',
    avatar: '',
  };
  messages = [
    {
      id: 1,
      sender: 'Natasha Romanoff',
      message: 'Hey, I need some help here.',
      time: '15:45',
      isMe: false,
    },
    {
      id: 2,
      sender: 'You',
      message: 'Sure! What do you need help with?',
      time: '15:46',
      isMe: true,
    },
    {
      id: 3,
      sender: 'Natasha Romanoff',
      message: 'I think my login is not working.',
      time: '15:47',
      isMe: false,
    },
    {
      id: 4,
      sender: 'You',
      message: 'Oh, I see. Did you forget your password?',
      time: '15:48',
      isMe: true,
    },
    {
      id: 5,
      sender: 'Natasha Romanoff',
      message: "No, I just reset it but it's still not working.",
      time: '15:49',
      isMe: false,
    },
    {
      id: 6,
      sender: 'You',
      message: 'Okay, let me check on the backend.',
      time: '15:50',
      isMe: true,
    },
    {
      id: 7,
      sender: 'Natasha Romanoff',
      message: 'Thanks, let me know what you find.',
      time: '15:51',
      isMe: false,
    },
    {
      id: 8,
      sender: 'You',
      message: "Sure, I'll keep you posted.",
      time: '15:52',
      isMe: true,
    },
    {
      id: 9,
      sender: 'Natasha Romanoff',
      message: 'Great, thanks!',
      time: '15:53',
      isMe: false,
    },
    {
      id: 10,
      sender: 'You',
      message: "You're welcome.",
      time: '15:54',
      isMe: true,
    },
    {
      id: 11,
      sender: 'Natasha Romanoff',
      message: 'Hey, how are you?',
      time: '15:35',
      isMe: false,
    },
    {
      id: 12,
      sender: 'You',
      message: "I'm good, thanks for asking.",
      time: '15:36',
      isMe: true,
    },
    {
      id: 13,
      sender: 'Natasha Romanoff',
      message: "That's good to hear.",
      time: '15:37',
      isMe: false,
    },
    {
      id: 14,
      sender: 'You',
      message: 'Yeah, how about you?',
      time: '15:38',
      isMe: true,
    },
    {
      id: 15,
      sender: 'Natasha Romanoff',
      message: "I'm good too.",
      time: '15:39',
      isMe: false,
    },
    {
      id: 16,
      sender: 'You',
      message: "That's great.",
      time: '15:40',
      isMe: true,
    },
    {
      id: 17,
      sender: 'Natasha Romanoff',
      message: 'Thanks, let me know what you find.',
      time: '15:45',
      isMe: false,
    },
  ].reverse();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedChat'] && this.selectedChat) {
      this.chatUser = {
        name: this.selectedChat.user.name,
        avatar: this.selectedChat.user.avatar,
      };
      // You can also update messages based on selected chat here
    }
  }
}
