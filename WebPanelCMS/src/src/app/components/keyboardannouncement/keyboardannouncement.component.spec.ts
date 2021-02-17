import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardannouncementComponent } from './keyboardannouncement.component';

describe('KeyboardannouncementComponent', () => {
  let component: KeyboardannouncementComponent;
  let fixture: ComponentFixture<KeyboardannouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyboardannouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardannouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
