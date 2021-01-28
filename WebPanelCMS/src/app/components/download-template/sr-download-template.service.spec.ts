import { TestBed } from '@angular/core/testing';

import { SrDownloadTemplateService } from './sr-download-template.service';

describe('SrDownloadTemplateService', () => {
  let service: SrDownloadTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrDownloadTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
