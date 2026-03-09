import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeWagerComponent } from './propose-wager.component';

describe('ProposeWagerComponent', () => {
  let component: ProposeWagerComponent;
  let fixture: ComponentFixture<ProposeWagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposeWagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProposeWagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
