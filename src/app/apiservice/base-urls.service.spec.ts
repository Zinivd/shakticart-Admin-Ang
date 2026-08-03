import { TestBed } from '@angular/core/testing';

import { BaseUrlsService } from './base-urls.service';

describe('BaseUrlsService', () => {
  let service: BaseUrlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseUrlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
