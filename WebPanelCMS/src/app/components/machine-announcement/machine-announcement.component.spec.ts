import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineAnnouncementComponent } from './machine-announcement.component';

describe('MachineAnnouncementComponent', () => {
  let component: MachineAnnouncementComponent;
  let fixture: ComponentFixture<MachineAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
