import { TestBed } from '@angular/core/testing';

import { TokenInfoServiceService } from './token-info-service.service';

describe('TokenInfoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenInfoServiceService = TestBed.get(TokenInfoServiceService);
    expect(service).toBeTruthy();
  });
});
