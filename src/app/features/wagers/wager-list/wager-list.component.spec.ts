import { TestBed } from '@angular/core/testing';
import { WagerListComponent } from './wager-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('WagerListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WagerListComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(WagerListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
