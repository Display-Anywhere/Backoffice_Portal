import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsTitlesDownloadStatusComponent } from './playlists-titles-download-status.component';

describe('PlaylistsTitlesDownloadStatusComponent', () => {
  let component: PlaylistsTitlesDownloadStatusComponent;
  let fixture: ComponentFixture<PlaylistsTitlesDownloadStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsTitlesDownloadStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsTitlesDownloadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
