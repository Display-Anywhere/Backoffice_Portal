import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoteltvPlayedLogsComponent } from './hoteltv-played-logs.component';

describe('HoteltvPlayedLogsComponent', () => {
  let component: HoteltvPlayedLogsComponent;
  let fixture: ComponentFixture<HoteltvPlayedLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoteltvPlayedLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoteltvPlayedLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
