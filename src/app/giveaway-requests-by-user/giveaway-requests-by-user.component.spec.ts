import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveawayRequestsByUserComponent } from './giveaway-requests-by-user.component';

describe('GiveawayRequestsByUserComponent', () => {
  let component: GiveawayRequestsByUserComponent;
  let fixture: ComponentFixture<GiveawayRequestsByUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveawayRequestsByUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveawayRequestsByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
