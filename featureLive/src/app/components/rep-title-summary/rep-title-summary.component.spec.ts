import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepTitleSummaryComponent } from './rep-title-summary.component';

describe('RepTitleSummaryComponent', () => {
  let component: RepTitleSummaryComponent;
  let fixture: ComponentFixture<RepTitleSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepTitleSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepTitleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
