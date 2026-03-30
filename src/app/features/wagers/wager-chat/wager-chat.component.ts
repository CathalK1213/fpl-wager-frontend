import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { WagerChatService } from '../../../core/services/wager-chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { WagerMessage } from '../../../core/models/wager';
import { environment } from '../../../../environments/environment';

interface GiphyResult {
  id: string;
  images: {
    fixed_height: { url: string };
    original: { url: string };
  };
}

@Component({
  selector: 'app-wager-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  template: `
    <div class="chat-container">

      <!-- Header -->
      <div class="chat-header">
        <a mat-icon-button [routerLink]="['/groups', groupId, 'wagers']">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <div class="header-info">
          <h2>Wager Chat</h2>
          <span class="subtext" *ngIf="opponentUsername">vs {{ opponentUsername }}</span>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Messages -->
      <div class="messages-list" #messageContainer>
        <div *ngIf="messages.length === 0" class="empty-state">
          <mat-icon>chat_bubble_outline</mat-icon>
          <p>No messages yet. Start the banter!</p>
        </div>

        <div *ngFor="let msg of messages"
             class="message-row"
             [class.own]="msg.senderUsername === currentUsername">
          <div class="message-bubble">
            <span class="sender" *ngIf="msg.senderUsername !== currentUsername">
              {{ msg.senderUsername }}
            </span>
            <p *ngIf="msg.messageType === 'TEXT'" class="message-text">{{ msg.content }}</p>
            <img *ngIf="msg.messageType === 'GIF'"
                 [src]="msg.gifUrl"
                 class="message-gif"
                 alt="GIF" />
            <div *ngIf="msg.messageType === 'VIDEO'" class="video-embed">
              <a [href]="msg.videoUrl" target="_blank" rel="noopener">
                <mat-icon>play_circle</mat-icon> {{ msg.videoUrl }}
              </a>
            </div>
            <span class="timestamp">{{ msg.sentAt | date:'HH:mm' }}</span>
          </div>
        </div>
      </div>

      <!-- GIF Picker -->
      <div class="gif-picker" *ngIf="showGifPicker">
        <div class="gif-search">
          <mat-form-field appearance="outline" class="gif-search-field">
            <mat-label>Search GIFs</mat-label>
            <input matInput
                   [(ngModel)]="gifSearchQuery"
                   (input)="searchGifs()"
                   placeholder="e.g. celebration, sad, angry..." />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        <div class="gif-grid" *ngIf="gifResults.length > 0">
          <img *ngFor="let gif of gifResults"
               [src]="gif.images.fixed_height.url"
               class="gif-thumb"
               (click)="sendGif(gif)"
               alt="GIF" />
        </div>
        <p class="gif-empty" *ngIf="gifResults.length === 0 && gifSearchQuery">
          No GIFs found. Try a different search.
        </p>
        <p class="gif-hint" *ngIf="!gifSearchQuery">
          Type to search GIPHY...
        </p>
      </div>

      <!-- Input area -->
      <div class="input-area">
        <button mat-icon-button (click)="toggleGifPicker()" [color]="showGifPicker ? 'primary' : ''">
          <mat-icon>gif</mat-icon>
        </button>
        <mat-form-field appearance="outline" class="message-input">
          <input matInput
                 [(ngModel)]="newMessage"
                 placeholder="Type a message..."
                 (keydown.enter)="sendText()"
                 [disabled]="sending || showGifPicker" />
        </mat-form-field>
        <button mat-icon-button color="primary"
                (click)="sendText()"
                [disabled]="!newMessage.trim() || sending || showGifPicker">
          <mat-icon>send</mat-icon>
        </button>
      </div>

    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 64px);
      max-width: 700px;
      margin: 0 auto;
    }

    .chat-header {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      gap: 8px;

      .header-info h2 { margin: 0; font-size: 1.1rem; }
      .subtext { font-size: 0.85rem; opacity: 0.7; }
    }

    .messages-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      opacity: 0.5;
      gap: 8px;
      mat-icon { font-size: 48px; width: 48px; height: 48px; }
    }

    .message-row {
      display: flex;
      justify-content: flex-start;

      &.own {
        justify-content: flex-end;
        .message-bubble {
          background: #e91e8c;
          color: white;
          border-radius: 18px 18px 4px 18px;
          .sender { display: none; }
          .timestamp { color: rgba(255,255,255,0.7); }
        }
      }
    }

    .message-bubble {
      max-width: 70%;
      background: #2a2a2a;
      border-radius: 18px 18px 18px 4px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .sender { font-size: 0.75rem; font-weight: 600; color: #e91e8c; }
      .message-text { margin: 0; font-size: 0.95rem; word-break: break-word; }
      .message-gif { max-width: 100%; max-height: 200px; border-radius: 8px; }
      .video-embed a {
        display: flex; align-items: center; gap: 4px;
        color: #e91e8c; font-size: 0.85rem; word-break: break-all;
      }
      .timestamp { font-size: 0.7rem; opacity: 0.6; align-self: flex-end; }
    }

    .gif-picker {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 12px 16px;
      max-height: 280px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .gif-search-field { width: 100%; margin-bottom: -1.25em; }

      .gif-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        overflow-y: auto;
        max-height: 180px;

        .gif-thumb {
          width: 100%;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.15s;
          &:hover { opacity: 0.8; }
        }
      }

      .gif-empty, .gif-hint {
        text-align: center;
        opacity: 0.5;
        font-size: 0.85rem;
        margin: 0;
      }
    }

    .input-area {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      gap: 8px;
      border-top: 1px solid rgba(255,255,255,0.1);

      .message-input { flex: 1; margin-bottom: -1.25em; }
    }
  `]
})
export class WagerChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  messages: WagerMessage[] = [];
  newMessage = '';
  sending = false;
  wagerId!: number;
  groupId!: number;
  currentUsername = '';
  opponentUsername = '';
  private shouldScroll = false;

  // GIF picker state
  showGifPicker = false;
  gifSearchQuery = '';
  gifResults: GiphyResult[] = [];
  private gifSearchTimer: any;

  constructor(
    private route: ActivatedRoute,
    private wagerChatService: WagerChatService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.wagerId = Number(this.route.snapshot.paramMap.get('wagerId'));
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));

    this.authService.currentUser$.subscribe(user => {
      this.currentUsername = user?.username ?? '';
    });

    this.loadHistory();
    this.wagerChatService.connect(this.wagerId, (msg) => {
      this.messages.push(msg);
      this.shouldScroll = true;
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.wagerChatService.disconnect();
  }

  loadHistory(): void {
    this.wagerChatService.getMessages(this.wagerId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.shouldScroll = true;
        const other = messages.find(m => m.senderUsername !== this.currentUsername);
        if (other) this.opponentUsername = other.senderUsername;
      },
      error: () => {}
    });
  }

  sendText(): void {
    if (!this.newMessage.trim() || this.sending) return;
    this.sending = true;
    this.wagerChatService.sendMessage({
      wagerId: this.wagerId,
      content: this.newMessage.trim(),
      messageType: 'TEXT'
    }).subscribe({
      next: () => { this.newMessage = ''; this.sending = false; },
      error: () => { this.sending = false; }
    });
  }

  toggleGifPicker(): void {
    this.showGifPicker = !this.showGifPicker;
    if (!this.showGifPicker) {
      this.gifSearchQuery = '';
      this.gifResults = [];
    }
  }

  searchGifs(): void {
    clearTimeout(this.gifSearchTimer);
    if (!this.gifSearchQuery.trim()) {
      this.gifResults = [];
      return;
    }
    // Debounce — wait 400ms after user stops typing
    this.gifSearchTimer = setTimeout(() => {
      const key = environment.giphyApiKey;
      const query = encodeURIComponent(this.gifSearchQuery);
      this.http.get<any>(
        `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${query}&limit=9&rating=pg-13`
      ).subscribe({
        next: (res) => { this.gifResults = res.data; },
        error: () => { this.gifResults = []; }
      });
    }, 400);
  }

  sendGif(gif: GiphyResult): void {
    this.wagerChatService.sendMessage({
      wagerId: this.wagerId,
      gifUrl: gif.images.original.url,
      messageType: 'GIF'
    }).subscribe({
      next: () => {
        this.showGifPicker = false;
        this.gifSearchQuery = '';
        this.gifResults = [];
      },
      error: () => {}
    });
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch {}
  }
}
