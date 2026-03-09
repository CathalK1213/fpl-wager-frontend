import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { TrashTalkMessage, SendMessageRequest } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class TrashTalkService {
  private apiUrl = environment.apiUrl;
  private stompClient: Client | null = null;

  constructor(private http: HttpClient) {}

  getMessages(groupId: number, gameweek: number): Observable<TrashTalkMessage[]> {
    return this.http.get<TrashTalkMessage[]>(
      `${this.apiUrl}/groups/${groupId}/trash-talk/${gameweek}`
    );
  }

  sendMessage(request: SendMessageRequest): Observable<TrashTalkMessage> {
    return this.http.post<TrashTalkMessage>(`${this.apiUrl}/trash-talk`, request);
  }

  connect(groupId: number, gameweek: number, onMessage: (msg: TrashTalkMessage) => void): void {
    const wsUrl = this.apiUrl.replace('/api', '') + '/ws';

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      onConnect: () => {
        this.stompClient?.subscribe(
          `/topic/group/${groupId}/gameweek/${gameweek}`,
          (message) => {
            const msg: TrashTalkMessage = JSON.parse(message.body);
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
