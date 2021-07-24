import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempScheduleComponent } from './temp-schedule.component';

describe('TempScheduleComponent', () => {
  let component: TempScheduleComponent;
  let fixture: ComponentFixture<TempScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
