import { TestBed } from '@angular/core/testing';

import { CognitiveService } from './cognitive.service';

describe('CognitiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CognitiveService = TestBed.get(CognitiveService);
    expect(service).toBeTruthy();
  });
});
