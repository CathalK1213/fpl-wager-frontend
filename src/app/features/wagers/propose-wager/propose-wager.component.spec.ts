import { TestBed } from '@angular/core/testing';
import { ProposeWagerComponent } from './propose-wager.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ProposeWagerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposeWagerComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProposeWagerComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
