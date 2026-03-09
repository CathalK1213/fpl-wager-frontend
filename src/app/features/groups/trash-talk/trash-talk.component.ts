import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TrashTalkService } from '../../../core/services/trash-talk.service';
import { TrashTalkMessage } from '../../../core/models/group';

@Component({
  selector: 'app-trash-talk',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>Trash Talk — GW{{ gameweek }}</h2>
        <a mat-button [routerLink]="['/groups', groupId]">Back to Group</a>
      </div>

      <mat-card class="chat-card">
        <mat-card-content>
          <div class="messages" #messageContainer>
            <div *ngIf="messages.length === 0" class="empty">
              No messages yet. Start the trash talk!
            </div>

            <div *ngFor="let msg of messages"
                 class="message"
                 [class.own-message]="msg.senderUsername === currentUsername">
              <div class="message-bubble">
                <span class="sender">{{ msg.senderUsername }}</span>
                <p *ngIf="msg.messageType === 'TEXT'">{{ msg.content }}</p>
                <img *ngIf="msg.messageType === 'GIF'" [src]="msg.gifUrl" alt="GIF" class="gif">
                <span class="time">{{ msg.sentAt | date:'shortTime' }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions class="input-area">
          <mat-form-field appearance="outline" class="message-input">
            <input matInput [formControl]="messageControl"
                   placeholder="Say something..."
                   (keyup.enter)="sendMessage()">
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="sendMessage()" [disabled]="!messageControl.value">
            <mat-icon>send</mat-icon>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 32px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .chat-card {
      height: 600px;
      display: flex;
      flex-direction: column;
    }
    .messages {
      height: 480px;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .message {
      display: flex;
      justify-content: flex-start;
    }
    .own-message {
      justify-content: flex-end;
    }
    .message-bubble {
      max-width: 70%;
      background: #3a3a3a;
      padding: 8px 12px;
      border-radius: 12px;
    }
    .own-message .message-bubble {
      background: #c2185b;
      color: white;
    }
    .sender {
      font-size: 11px;
      font-weight: bold;
      display: block;
      margin-bottom: 4px;
      opacity: 0.8;
    }
    .time {
      font-size: 10px;
      opacity: 0.6;
      display: block;
      text-align: right;
      margin-top: 4px;
    }
    .gif {
      max-width: 200px;
      border-radius: 8px;
    }
    .empty {
      text-align: center;
      color: grey;
      font-style: italic;
      margin: auto;
    }
    .input-area {
      display: flex;
      gap: 8px;
      padding: 16px;
      align-items: center;
    }
    .message-input {
      flex: 1;
    }
  `]
})
export class TrashTalkComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  messages: TrashTalkMessage[] = [];
  messageControl = new FormControl('');
  groupId!: number;
  gameweek!: number;
  currentUsername = '';

  constructor(private route: ActivatedRoute, private trashTalkService: TrashTalkService) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.gameweek = Number(this.route.snapshot.paramMap.get('gameweek'));

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUsername = JSON.parse(storedUser).username;
    }

    this.trashTalkService.getMessages(this.groupId, this.gameweek).subscribe({
      next: (messages) => this.messages = messages
    });

    this.trashTalkService.connect(this.groupId, this.gameweek, (msg) => {
      if (!this.messages.find(m => m.id === msg.id)) {
        this.messages.push(msg);
      }
    });
  }

  ngOnDestroy(): void {
    this.trashTalkService.disconnect();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    const content = this.messageControl.value?.trim();
    if (!content) return;

    this.trashTalkService.sendMessage({
      groupId: this.groupId,
      gameweek: this.gameweek,
      content,
      messageType: 'TEXT'
    }).subscribe({
      next: () => this.messageControl.reset()
    });
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch {}
  }
}
