import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  // Currently component is in-progress

  constructor(private router: Router) {}

  ngOnInit(): void {}

  forgotPassword(): void {
    // More stuff will go here once I set up cognito

    console.log('You have requested a new password');

    this.router.navigate(['/']);
  }
}
