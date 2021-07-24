import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalscheduleComponent } from './normalschedule.component';

describe('NormalscheduleComponent', () => {
  let component: NormalscheduleComponent;
  let fixture: ComponentFixture<NormalscheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalscheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
