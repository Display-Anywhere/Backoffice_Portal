import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseHolderComponent } from './license-holder.component';

describe('LicenseHolderComponent', () => {
  let component: LicenseHolderComponent;
  let fixture: ComponentFixture<LicenseHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
