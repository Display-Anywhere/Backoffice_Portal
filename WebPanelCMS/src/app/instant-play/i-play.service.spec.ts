import { TestBed } from '@angular/core/testing';

import { IPlayService } from './i-play.service';

describe('IPlayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IPlayService = TestBed.get(IPlayService);
    expect(service).toBeTruthy();
  });
});
