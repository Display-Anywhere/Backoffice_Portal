import { TestBed } from '@angular/core/testing';

import { SerCopyDataService } from './ser-copy-data.service';

describe('SerCopyDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SerCopyDataService = TestBed.get(SerCopyDataService);
    expect(service).toBeTruthy();
  });
});
