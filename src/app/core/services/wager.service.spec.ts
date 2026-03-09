import { TestBed } from '@angular/core/testing';
import { WagerService } from './wager.service';
import { provideHttpClient } from '@angular/common/http';

describe('WagerService', () => {
  let service: WagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(WagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
