import { TestBed } from '@angular/core/testing';
import { GroupLeaderboardComponent } from './group-leaderboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('GroupLeaderboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupLeaderboardComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GroupLeaderboardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
