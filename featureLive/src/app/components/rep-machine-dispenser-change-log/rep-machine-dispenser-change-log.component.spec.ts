import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepMachineDispenserChangeLogComponent } from './rep-machine-dispenser-change-log.component';

describe('RepMachineDispenserChangeLogComponent', () => {
  let component: RepMachineDispenserChangeLogComponent;
  let fixture: ComponentFixture<RepMachineDispenserChangeLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepMachineDispenserChangeLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepMachineDispenserChangeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
