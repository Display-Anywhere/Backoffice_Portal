import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterscheduleAdPlaylistsComponent } from './masterschedule-ad-playlists.component';

describe('MasterscheduleAdPlaylistsComponent', () => {
  let component: MasterscheduleAdPlaylistsComponent;
  let fixture: ComponentFixture<MasterscheduleAdPlaylistsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterscheduleAdPlaylistsComponent]
    });
    fixture = TestBed.createComponent(MasterscheduleAdPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
