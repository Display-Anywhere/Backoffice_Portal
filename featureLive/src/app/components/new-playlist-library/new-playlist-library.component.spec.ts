import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlaylistLibraryComponent } from './new-playlist-library.component';

describe('NewPlaylistLibraryComponent', () => {
  let component: NewPlaylistLibraryComponent;
  let fixture: ComponentFixture<NewPlaylistLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPlaylistLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPlaylistLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
