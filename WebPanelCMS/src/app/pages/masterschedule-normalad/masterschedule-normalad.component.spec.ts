import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterscheduleNormaladComponent } from './masterschedule-normalad.component';

describe('MasterscheduleNormaladComponent', () => {
  let component: MasterscheduleNormaladComponent;
  let fixture: ComponentFixture<MasterscheduleNormaladComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterscheduleNormaladComponent]
    });
    fixture = TestBed.createComponent(MasterscheduleNormaladComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
