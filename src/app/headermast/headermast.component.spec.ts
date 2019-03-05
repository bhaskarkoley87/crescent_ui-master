import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadermastComponent } from './headermast.component';

describe('HeadermastComponent', () => {
  let component: HeadermastComponent;
  let fixture: ComponentFixture<HeadermastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadermastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadermastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
