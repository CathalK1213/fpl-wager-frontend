import { TestBed } from '@angular/core/testing';
import { CreateGroupComponent } from './create-group.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('CreateGroupComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGroupComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CreateGroupComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
