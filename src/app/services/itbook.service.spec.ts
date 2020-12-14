import { TestBed } from '@angular/core/testing';

import { ItbookService } from './itbook.service';

describe('ItbookService', () => {
  let service: ItbookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItbookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
