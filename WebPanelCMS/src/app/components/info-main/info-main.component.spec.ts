import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMainComponent } from './info-main.component';

describe('InfoMainComponent', () => {
  let component: InfoMainComponent;
  let fixture: ComponentFixture<InfoMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
