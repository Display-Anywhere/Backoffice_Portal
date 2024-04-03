import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagegroupsComponent } from './managegroups.component';

describe('ManagegroupsComponent', () => {
  let component: ManagegroupsComponent;
  let fixture: ComponentFixture<ManagegroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagegroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagegroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
