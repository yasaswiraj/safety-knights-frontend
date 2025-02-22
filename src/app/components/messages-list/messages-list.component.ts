import { Component } from '@angular/core';
import { time } from 'console';
import { identity, last } from 'rxjs';

@Component({
  selector: 'app-messages-list',
  imports: [],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css'
})
export class MessagesListComponent {
  chats = [
    {
      id: 1,
      user:{
        name: 'Natasha',
        avatar: 'https://randomuser.me/api/portraits/women/79.jpg' 
      },
      lastMessage: 'I need some help here',
      time: '15:45',
    },
    {
      id: 2,
      user:{
        name: 'Chris Hemsworth',
        avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
      },
      lastMessage: "I can't find Loki again!",
      time: '12:45',
    }
  ];

}
