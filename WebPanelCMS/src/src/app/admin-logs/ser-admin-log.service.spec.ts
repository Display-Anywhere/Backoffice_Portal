import { TestBed } from '@angular/core/testing';

import { SerAdminLogService } from './ser-admin-log.service';

describe('SerAdminLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SerAdminLogService = TestBed.get(SerAdminLogService);
    expect(service).toBeTruthy();
  });
});
