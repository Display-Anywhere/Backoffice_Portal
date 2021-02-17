import { TestBed } from '@angular/core/testing';

import { SerLicenseHolderService } from './ser-license-holder.service';

describe('SerLicenseHolderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SerLicenseHolderService = TestBed.get(SerLicenseHolderService);
    expect(service).toBeTruthy();
  });
});
