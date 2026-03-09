import { TestBed } from '@angular/core/testing';
import { DebtTrackerComponent } from './debt-tracker.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('DebtTrackerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtTrackerComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DebtTrackerComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
