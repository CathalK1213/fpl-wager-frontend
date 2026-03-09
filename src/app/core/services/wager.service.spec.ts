import { TestBed } from '@angular/core/testing';

import { WagerService } from './wager.service';

describe('WagerService', () => {
  let service: WagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
