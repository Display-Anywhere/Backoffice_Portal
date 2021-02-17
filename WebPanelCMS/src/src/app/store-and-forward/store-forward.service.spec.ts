import { TestBed } from '@angular/core/testing';

import { StoreForwardService } from './store-forward.service';

describe('StoreForwardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreForwardService = TestBed.get(StoreForwardService);
    expect(service).toBeTruthy();
  });
});
