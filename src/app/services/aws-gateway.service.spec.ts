import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AwsGatewayService } from './aws-gateway.service';

describe('AwsGatewayService', () => {
  let service: AwsGatewayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
    });
    service = TestBed.inject(AwsGatewayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
