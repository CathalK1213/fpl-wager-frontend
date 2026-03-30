import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { WagerMessage, SendWagerMessageRequest } from '../models/wager';

@Injectable({
  providedIn: 'root'
})
export class WagerChatService {
  private apiUrl = environment.apiUrl;
  private stompClient: Client | null = null;

  constructor(private http: HttpClient) {}

  getMessages(wagerId: number): Observable<WagerMessage[]> {
    return this.http.get<WagerMessage[]>(`${this.apiUrl}/wagers/${wagerId}/messages`);
  }

  sendMessage(request: SendWagerMessageRequest): Observable<WagerMessage> {
    return this.http.post<WagerMessage>(`${this.apiUrl}/wager-chat`, request);
  }

  connect(wagerId: number, onMessage: (msg: WagerMessage) => void): void {
    const wsUrl = this.apiUrl.replace('/api', '') + '/ws';
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      onConnect: () => {
        this.stompClient?.subscribe(
          `/topic/wager/${wagerId}/chat`,
          (message) => {
            const msg: WagerMessage = JSON.parse(message.body);
            onMessage(msg);
          }
        );
      },
      reconnectDelay: 5000
    });
    this.stompClient.activate();
  }

  disconnect(): void {
    this.stompClient?.deactivate();
    this.stompClient = null;
  }
}
