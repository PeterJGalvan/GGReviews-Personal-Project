import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CognitoService } from '../services/cognito.service';
import { AwsGatewayService } from '../services/aws-gateway.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userName: string;
  isThisYourProfile: boolean;
  profileStatsFetched: boolean;
  checkedWhomProfileDone: boolean;
  noUser: boolean;

  followerCount: number;
  followingCount: number;
  reviewCount: number;
  pictureURL: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cognitoService: CognitoService,
    private awsGatewayService: AwsGatewayService
  ) {
    this.userName = '';
    this.isThisYourProfile = false;
    this.profileStatsFetched = false;
    this.checkedWhomProfileDone = false;
    this.noUser = false;

    this.followerCount = 0;
    this.followingCount = 0;
    this.reviewCount = 0;
    this.pictureURL = '';
  }

  ngOnInit(): void {
    this.userName = String(this.activatedRoute.snapshot.paramMap.get('id'));

    this.checkWhomsProfile();
    this.getUserProfileStats();

    // scroll to top of screen (Put here because won't show navbar)
    window.scrollTo(0, 0);
  }

  checkWhomsProfile(): void {
    this.cognitoService.getUser().then((data) => {
      if (data['username'] === this.userName) {
        this.isThisYourProfile = true;
      } else {
        this.isThisYourProfile = false;
      }

      this.checkedWhomProfileDone = true;
    });
  }

  getUserProfileStats(): void {
    this.awsGatewayService
      .getProfileStats(this.userName)
      .subscribe((data: any) => {
        if (data !== null) {
          this.followerCount = data[0]['FollowerCount'];
          this.followingCount = data[0]['FollowingCount'];
          this.reviewCount = data[0]['ReviewCount'];
          this.pictureURL = data[0]['PictureURL'];
        } else {
          this.noUser = true;
        }

        console.log(
          'Information on profile stats:',
          this.followerCount,
          this.followingCount,
          this.reviewCount,
          this.pictureURL
        );

        this.profileStatsFetched = true;
      });
  }
}
