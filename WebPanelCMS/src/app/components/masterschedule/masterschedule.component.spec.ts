import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterscheduleComponent } from './masterschedule.component';

describe('MasterscheduleComponent', () => {
  let component: MasterscheduleComponent;
  let fixture: ComponentFixture<MasterscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterscheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
