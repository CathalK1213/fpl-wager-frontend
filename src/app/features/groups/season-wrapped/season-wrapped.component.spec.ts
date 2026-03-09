import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonWrappedComponent } from './season-wrapped.component';

describe('SeasonWrappedComponent', () => {
  let component: SeasonWrappedComponent;
  let fixture: ComponentFixture<SeasonWrappedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonWrappedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeasonWrappedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
