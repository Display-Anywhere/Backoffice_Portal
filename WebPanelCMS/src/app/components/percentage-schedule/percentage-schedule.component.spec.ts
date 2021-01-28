import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageScheduleComponent } from './percentage-schedule.component';

describe('PercentageScheduleComponent', () => {
  let component: PercentageScheduleComponent;
  let fixture: ComponentFixture<PercentageScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
