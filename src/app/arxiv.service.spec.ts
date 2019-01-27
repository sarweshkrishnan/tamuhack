import { TestBed } from '@angular/core/testing';

import { ArxivService } from './arxiv.service';

describe('ArxivService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArxivService = TestBed.get(ArxivService);
    expect(service).toBeTruthy();
  });
});
