import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepTokenInfoComponent } from './rep-token-info.component';

describe('RepTokenInfoComponent', () => {
  let component: RepTokenInfoComponent;
  let fixture: ComponentFixture<RepTokenInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepTokenInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepTokenInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
