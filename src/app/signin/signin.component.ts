import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService, IUser } from '../services/cognito.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  loading: boolean;
  user: IUser;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;
    this.user.username = '';
    this.user.password = '';
  }

  ngOnInit(): void {}

  signIn(): void {
    this.loading = true;
    this.cognitoService
      .signIn(this.user)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(() => {
        this.loading = false;
      });
  }
}
