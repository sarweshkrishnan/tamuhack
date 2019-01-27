import { TestBed } from '@angular/core/testing';

import { OxfordService } from './oxford.service';

describe('OxfordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OxfordService = TestBed.get(OxfordService);
    expect(service).toBeTruthy();
  });
});
