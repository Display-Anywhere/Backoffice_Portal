import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepMachineLogsComponent } from './rep-machine-logs.component';

describe('RepMachineLogsComponent', () => {
  let component: RepMachineLogsComponent;
  let fixture: ComponentFixture<RepMachineLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepMachineLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepMachineLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
