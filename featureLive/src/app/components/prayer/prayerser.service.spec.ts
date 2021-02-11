import { TestBed } from '@angular/core/testing';

import { PrayerserService } from './prayerser.service';

describe('PrayerserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrayerserService = TestBed.get(PrayerserService);
    expect(service).toBeTruthy();
  });
});
