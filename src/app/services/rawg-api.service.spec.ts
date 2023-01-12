import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { RawgAPIService } from './rawg-api.service';

describe('RawgAPIService', () => {
  let service: RawgAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
    });
    service = TestBed.inject(RawgAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
