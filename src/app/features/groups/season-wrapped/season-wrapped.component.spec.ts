import { TestBed } from '@angular/core/testing';
import { SeasonWrappedComponent } from './season-wrapped.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('SeasonWrappedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonWrappedComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SeasonWrappedComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
