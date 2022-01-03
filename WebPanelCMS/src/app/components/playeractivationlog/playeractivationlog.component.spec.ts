import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayeractivationlogComponent } from './playeractivationlog.component';

describe('PlayeractivationlogComponent', () => {
  let component: PlayeractivationlogComponent;
  let fixture: ComponentFixture<PlayeractivationlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayeractivationlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayeractivationlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
