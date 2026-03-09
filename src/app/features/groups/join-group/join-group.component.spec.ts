import { TestBed } from '@angular/core/testing';
import { JoinGroupComponent } from './join-group.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('JoinGroupComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinGroupComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(JoinGroupComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
