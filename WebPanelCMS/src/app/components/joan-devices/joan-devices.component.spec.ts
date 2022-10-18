import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoanDevicesComponent } from './joan-devices.component';

describe('JoanDevicesComponent', () => {
  let component: JoanDevicesComponent;
  let fixture: ComponentFixture<JoanDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoanDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoanDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
