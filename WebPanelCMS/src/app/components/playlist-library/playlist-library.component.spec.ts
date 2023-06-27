import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistLibraryComponent } from './playlist-library.component';

describe('PlaylistLibraryComponent', () => {
  let component: PlaylistLibraryComponent;
  let fixture: ComponentFixture<PlaylistLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
