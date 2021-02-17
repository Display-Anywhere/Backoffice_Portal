import { TestBed } from '@angular/core/testing';

import { PlayerlogsService } from './playerlogs.service';

describe('PlayerlogsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerlogsService = TestBed.get(PlayerlogsService);
    expect(service).toBeTruthy();
  });
});
