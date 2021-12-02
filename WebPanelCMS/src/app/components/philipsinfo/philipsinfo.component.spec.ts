import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhilipsinfoComponent } from './philipsinfo.component';

describe('PhilipsinfoComponent', () => {
  let component: PhilipsinfoComponent;
  let fixture: ComponentFixture<PhilipsinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhilipsinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhilipsinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
