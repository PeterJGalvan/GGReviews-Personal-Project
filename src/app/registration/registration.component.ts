import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService, IUser } from '../services/cognito.service';
import { AwsGatewayService } from '../services/aws-gateway.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  loading: boolean;
  isConfirm: boolean;
  user: IUser;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private awsGatewayService: AwsGatewayService
  ) {
    this.loading = false;
    this.isConfirm = false;
    this.user = {} as IUser;
    this.user.email = '';
    this.user.username = '';
    this.user.password = '';
  }

  signUp(): void {
    this.loading = true;
    this.cognitoService
      .signUp(this.user)
      .then(() => {
        this.postProfileStats();
        this.loading = false;
        this.isConfirm = true;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  confirmSignUp(): void {
    this.loading = true;
    this.cognitoService
      .confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(() => {
        this.loading = false;
      });
  }

  postProfileStats(): void {
    this.awsGatewayService.postProfileStats(this.user.username);
  }
}
