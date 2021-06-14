import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantMobileComponent } from './instant-mobile.component';

describe('InstantMobileComponent', () => {
  let component: InstantMobileComponent;
  let fixture: ComponentFixture<InstantMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
