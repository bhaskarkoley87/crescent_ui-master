import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutreachUserRequestComponent } from './outreach-user-request.component';

describe('OutreachUserRequestComponent', () => {
  let component: OutreachUserRequestComponent;
  let fixture: ComponentFixture<OutreachUserRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutreachUserRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutreachUserRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
