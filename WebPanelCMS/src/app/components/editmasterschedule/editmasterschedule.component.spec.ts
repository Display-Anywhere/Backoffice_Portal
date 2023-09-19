import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmasterscheduleComponent } from './editmasterschedule.component';

describe('EditmasterscheduleComponent', () => {
  let component: EditmasterscheduleComponent;
  let fixture: ComponentFixture<EditmasterscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmasterscheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditmasterscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
