import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopysanitizerannouncementComponent } from './copysanitizerannouncement.component';

describe('CopysanitizerannouncementComponent', () => {
  let component: CopysanitizerannouncementComponent;
  let fixture: ComponentFixture<CopysanitizerannouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopysanitizerannouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopysanitizerannouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
