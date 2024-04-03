import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DComponent } from './d.component';

describe('DComponent', () => {
  let component: DComponent;
  let fixture: ComponentFixture<DComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DComponent]
    });
    fixture = TestBed.createComponent(DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
