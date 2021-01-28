import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPlaylistsComponent } from './ad-playlists.component';

describe('AdPlaylistsComponent', () => {
  let component: AdPlaylistsComponent;
  let fixture: ComponentFixture<AdPlaylistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdPlaylistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
