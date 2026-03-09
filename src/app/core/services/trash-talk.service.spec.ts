import { TestBed } from '@angular/core/testing';
import { TrashTalkService } from './trash-talk.service';
import { provideHttpClient } from '@angular/common/http';

describe('TrashTalkService', () => {
  let service: TrashTalkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(TrashTalkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
