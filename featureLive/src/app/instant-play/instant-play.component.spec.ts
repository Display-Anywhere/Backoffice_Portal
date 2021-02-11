import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantPlayComponent } from './instant-play.component';

describe('InstantPlayComponent', () => {
  let component: InstantPlayComponent;
  let fixture: ComponentFixture<InstantPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
