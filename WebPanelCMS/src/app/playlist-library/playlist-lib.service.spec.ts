import { TestBed } from '@angular/core/testing';

import { PlaylistLibService } from './playlist-lib.service';

describe('PlaylistLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlaylistLibService = TestBed.get(PlaylistLibService);
    expect(service).toBeTruthy();
  });
});
