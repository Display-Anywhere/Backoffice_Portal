import { TestBed } from '@angular/core/testing';

import { UloginService } from './ulogin.service';

describe('UloginService', () => {
  let service: UloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
