import { TestBed } from '@angular/core/testing';

import { SerReportService } from './ser-report.service';

describe('SerReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SerReportService = TestBed.get(SerReportService);
    expect(service).toBeTruthy();
  });
});
