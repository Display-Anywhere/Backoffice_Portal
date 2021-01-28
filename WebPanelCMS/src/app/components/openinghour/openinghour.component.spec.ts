import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeninghourComponent } from './openinghour.component';

describe('OpeninghourComponent', () => {
  let component: OpeninghourComponent;
  let fixture: ComponentFixture<OpeninghourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeninghourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeninghourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
