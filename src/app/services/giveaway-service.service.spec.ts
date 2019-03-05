import { TestBed } from '@angular/core/testing';

import { GiveawayService } from './giveaway-service.service';

describe('GiveawayServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GiveawayService = TestBed.get(GiveawayService);
    expect(service).toBeTruthy();
  });
});
