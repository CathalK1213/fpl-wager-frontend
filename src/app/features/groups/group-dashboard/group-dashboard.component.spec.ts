import { TestBed } from '@angular/core/testing';
import { GroupDashboardComponent } from './group-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('GroupDashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDashboardComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GroupDashboardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
