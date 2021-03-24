import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineAlertComponent } from './offline-alert.component';

describe('OfflineAlertComponent', () => {
  let component: OfflineAlertComponent;
  let fixture: ComponentFixture<OfflineAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
