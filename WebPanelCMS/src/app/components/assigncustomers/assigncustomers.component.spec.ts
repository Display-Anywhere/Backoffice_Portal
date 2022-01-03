import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigncustomersComponent } from './assigncustomers.component';

describe('AssigncustomersComponent', () => {
  let component: AssigncustomersComponent;
  let fixture: ComponentFixture<AssigncustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigncustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigncustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
