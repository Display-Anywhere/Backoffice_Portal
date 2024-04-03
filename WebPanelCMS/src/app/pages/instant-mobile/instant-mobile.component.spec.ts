import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantMobileComponent } from './instant-mobile.component';

describe('InstantMobileComponent', () => {
  let component: InstantMobileComponent;
  let fixture: ComponentFixture<InstantMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstantMobileComponent]
    });
    fixture = TestBed.createComponent(InstantMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
