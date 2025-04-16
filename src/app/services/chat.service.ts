import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Message {
  chat_id?: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  attachments?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl;
  private socket?: WebSocket;
  private socketInitialized = false; // New flag
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private messageSubject = new Subject<Message>();
  private deliveryStatusSubject = new Subject<{ message_id: number, delivered: boolean }>();
  private connectionEstablishedSubject = new Subject<number>();

  constructor(private http: HttpClient) {}

  // REST API: Send a message as fallback
  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/api/messages`, message, { withCredentials: true });
  }

  // REST API: Get conversation with another user
  getConversation(otherUserId: number, limit: number = 50, offset: number = 0): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.apiUrl}/api/messages/${otherUserId}?limit=${limit}&offset=${offset}`,
      { withCredentials: true }
    );
  }

  getConversationList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/messages/conversations`, {
      withCredentials: true
    });
  }
  

  // Initialize WebSocket connection with provided access token
  initWebSocket(token: string): void {
    if (this.socketInitialized) return;
    this.socketInitialized = true;

    if (this.socket) {
      this.socket.close(); // Cleanup any existing connection
    }
    this.socket = new WebSocket(`${this.apiUrl.replace(/^http/, 'ws')}/api/messages/ws?access_token=${token}`);

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'new_message':
          this.messageSubject.next(data.data);
          break;
        case 'delivery_status':
          this.deliveryStatusSubject.next({
            message_id: data.message_id,
            delivered: data.delivered
          });
          break;
        case 'connection_established':
          this.connectionEstablishedSubject.next(data.user_id);
          break;
        case 'message_sent':
          console.log('Message sent acknowledgment received:', data.data);
          break;
        case 'error':
          console.error('Server error:', data.error);
          break;
        default:
          console.warn('Unknown message type:', data);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = (event) => {
      console.warn('WebSocket closed:', event.reason || event.code);
      this.socket = undefined;
      this.socketInitialized = false; // Reset flag so that connection can be re-established if needed
    };
  }

  // Observable that emits incoming messages from WebSocket
  onNewMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  onDeliveryStatus(): Observable<{ message_id: number, delivered: boolean }> {
    return this.deliveryStatusSubject.asObservable();
  }

  onConnectionEstablished(): Observable<number> {
    return this.connectionEstablishedSubject.asObservable();
  }

  // Send a message using WebSocket with retry if not open
  sendWebSocketMessage(message: Message): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open. Message not sent. Retrying in 1s...');
      setTimeout(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(message));
          console.log('Message sent after retry.');
        } else {
          console.warn('WebSocket still not open. Message not sent.');
          // Optionally, add the message to a queue for future retry.
        }
      }, 1000);
    }
  }

  // New helper to check if the socket is open
  isSocketOpen(): boolean {
    // Force a boolean return value with the double bang operator
    return !!(this.socket && this.socket.readyState === WebSocket.OPEN);
  }

  // Close the WebSocket connection
  closeWebSocket(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
