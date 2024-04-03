import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormaladComponent } from './normalad.component';

describe('NormaladComponent', () => {
  let component: NormaladComponent;
  let fixture: ComponentFixture<NormaladComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormaladComponent]
    });
    fixture = TestBed.createComponent(NormaladComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
