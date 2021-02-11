import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepTokenPlayedSongComponent } from './rep-token-played-song.component';

describe('RepTokenPlayedSongComponent', () => {
  let component: RepTokenPlayedSongComponent;
  let fixture: ComponentFixture<RepTokenPlayedSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepTokenPlayedSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepTokenPlayedSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
