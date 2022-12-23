import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayedAdLogComponent } from './played-ad-log.component';

describe('PlayedAdLogComponent', () => {
  let component: PlayedAdLogComponent;
  let fixture: ComponentFixture<PlayedAdLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayedAdLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayedAdLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
