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
      user: {
        name: "Natasha Romanoff",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      },
      lastMessage: "Thanks, let me know what you find.",
      time: "15:45",
    },
    {
      id: 2,
      user: {
        name: "Chris Hemsworth",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      lastMessage: "I can't find Loki again!",
      time: "15:42",
    },
    {
      id: 3,
      user: {
        name: "Ana De Armas",
        avatar: "https://randomuser.me/api/portraits/women/30.jpg",
      },
      lastMessage: "Hey, how are you?",
      time: "15:35",
    },
    {
      id: 4,
      user: {
        name: "Peter Stark",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      },
      lastMessage: "Help me update my name!",
      time: "15:30",
    },
    {
      id: 5,
      user: {
        name: "Voldemort",
        avatar: "https://randomuser.me/api/portraits/men/99.jpg",
      },
      lastMessage: "Get me Potter!!!!",
      time: "15:25",
    },
    {
      id: 6,
      user: {
        name: "Barry Allen",
        avatar: "https://randomuser.me/api/portraits/men/40.jpg",
      },
      lastMessage: "Speed force is dying again.",
      time: "15:15",
    },
  ];
  

}
