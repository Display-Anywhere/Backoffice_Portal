import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyDataComponent } from './copy-data.component';

describe('CopyDataComponent', () => {
  let component: CopyDataComponent;
  let fixture: ComponentFixture<CopyDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
