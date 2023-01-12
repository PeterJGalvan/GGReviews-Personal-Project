import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../services/cognito.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean;
  userName: string;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.isAuthenticated = false;
    this.userName = '';
  }

  ngOnInit(): void {
    this.cognitoService.isAuthenticated().then((success: boolean) => {
      this.isAuthenticated = success;

      this.cognitoService.getUser().then((data) => {
        this.userName = data['username'];
      });

      if (this.isAuthenticated === false) {
        this.router.navigate(['/']);
      }
    });
  }

  signOut(): void {
    this.cognitoService.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
