import { TestBed, inject } from '@angular/core/testing';

import { DappServiceService } from './dapp-service.service';

describe('DappServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DappServiceService]
    });
  });

  it('should be created', inject([DappServiceService], (service: DappServiceService) => {
    expect(service).toBeTruthy();
  }));
});
