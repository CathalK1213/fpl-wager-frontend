import { TestBed } from '@angular/core/testing';
import { TrashTalkComponent } from './trash-talk.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('TrashTalkComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrashTalkComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TrashTalkComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
