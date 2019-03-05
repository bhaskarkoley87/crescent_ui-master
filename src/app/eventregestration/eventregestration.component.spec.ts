import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventregestrationComponent } from './eventregestration.component';

describe('EventregestrationComponent', () => {
  let component: EventregestrationComponent;
  let fixture: ComponentFixture<EventregestrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventregestrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventregestrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
