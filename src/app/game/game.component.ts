import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameInfo } from '../models/game-info.model';
import { RawgAPIService } from '../services/rawg-api.service';
import { CognitoService } from '../services/cognito.service';
import { AwsGatewayService } from '../services/aws-gateway.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  // Where current game info is stored
  game: GameInfo;

  // game slug is the current path
  gameSlug: string;

  // current user's user name
  userName: string;

  // Average rating for current game as a string
  avgRating: string;

  // Checking that all info has been attempted to be fetched
  reviewsFetched: boolean;
  personalReviewChecked: boolean;
  avgRatingCalculated: boolean;
  gameInfoFetched: boolean;
  // Checking that all info has been attempted to be fetched end

  // For disabling buttons when a post is sending
  postSending: boolean;

  // Where reviews will be stored
  reviews: any[];

  // Where past review info will be stored if user has written a review before
  personalReviewRating: string;
  personalReviewRatingID: string;
  personalReviewDescription: string;
  // Where past review info will be stored if user has written a review before ended

  // For Arrows Description
  descriptionArrowUp = true;
  reviewsArrowUp = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private RawgAPIService: RawgAPIService,
    private cognitoService: CognitoService,
    private AwsGatewayService: AwsGatewayService
  ) {
    // Declaring variables
    this.game = {
      id: '',
      idForDB: '',
      name: '',
      slug: '',
      description: '',
      released: '',
      backgroundImg: '',
    };
    this.reviewsFetched = false;
    this.postSending = false;
    this.personalReviewChecked = false;
    this.avgRatingCalculated = false;
    this.gameInfoFetched = false;
    this.reviews = [];
    this.gameSlug = String(this.activatedRoute.snapshot.paramMap.get('id'));
    this.userName = '';
    this.avgRating = '';
    this.personalReviewRating = '';
    this.personalReviewRatingID = '';
    this.personalReviewDescription = '';
  }

  ngOnInit(): void {
    this.cognitoService.getUser().then((data) => {
      this.userName = data['username'];
      this.getPersonalReviewInfo();
      this.getAvgRating();
      this.getReviewInfo();
      this.getGameInfo();
    });
  }

  // For hiding and showing game description
  displayTypeForDescription() {
    // If descriptionDiv is showing
    if (document.getElementById('descriptionDiv')?.style.display !== 'none') {
      // Don't show descriptionDiv
      document.getElementById('descriptionDiv')!.style.display = 'none';
      // Reverse Arrow
      this.descriptionArrowUp = false;
    }
    // descriptionDiv is not showing
    else {
      // show descriptionDiv
      document.getElementById('descriptionDiv')!.style.display = 'block';
      // Reverse Arrow
      this.descriptionArrowUp = true;
    }
  }

  // For hiding and showing reviews
  displayTypeForReviews() {
    // If reviewsDiv is showing
    if (document.getElementById('reviewsDiv')?.style.display !== 'none') {
      // Don't show reviewsDiv
      document.getElementById('reviewsDiv')!.style.display = 'none';
      // Reverse Arrow
      this.reviewsArrowUp = false;
    }
    // reviewsDiv is not showing
    else {
      // show reviewsDiv
      document.getElementById('reviewsDiv')!.style.display = 'block';
      // Reverse Arrow
      this.reviewsArrowUp = true;
    }
  }

  // Get game info
  getGameInfo() {
    this.RawgAPIService.getGameInfo(String(this.gameSlug)).subscribe(
      (data: any) => {
        // Set game to data
        this.game = data;

        // game info attempted to be fetched
        this.gameInfoFetched = true;
      }
    );
  }

  // Get review info
  getReviewInfo() {
    this.AwsGatewayService.getReviews('singleGame', this.gameSlug).subscribe(
      (data: any[]) => {
        // make sure data exist
        if (data !== null) {
          // set reviews to data
          this.reviews = data;
        }

        // console log information gotten back
        console.log('Information on reviews:', this.reviews);

        // review info attempted to be fetched
        this.reviewsFetched = true;
      }
    );
  }

  // Get personal review info
  getPersonalReviewInfo() {
    this.AwsGatewayService.checkForReview(
      this.gameSlug,
      this.userName
    ).subscribe((data: any[]) => {
      // make sure data exist
      if (data !== null) {
        // Set data values
        this.personalReviewDescription = data[0]['descriptionValue'];
        this.personalReviewRating = data[0]['rating'];
        this.personalReviewRatingID = data[0]['ratingID'];
      }

      // console log information gotten back
      console.log(
        'Personal Review:',
        this.personalReviewDescription,
        this.personalReviewRating,
        this.personalReviewRatingID
      );

      // personal review info attempted to be fetched
      this.personalReviewChecked = true;
    });
  }

  // Get average rating
  getAvgRating() {
    this.AwsGatewayService.getAverageRating(this.gameSlug).subscribe(
      (data: any) => {
        // set avg rating to data;

        // figure out what the string value will be
        if (data === 5) {
          this.avgRating = 'Highly Recommend';
        } else if (data === 4) {
          this.avgRating = 'Recommend';
        } else if (data === 3) {
          this.avgRating = 'By Partial';
        } else if (data === 2) {
          this.avgRating = 'Not Recommend';
        } else if (data === 1) {
          this.avgRating = 'Highly Not Recommend';
        } else {
          this.avgRating = 'Not Rated';
        }

        // Average rating calculated
        this.avgRatingCalculated = true;
      }
    );
  }

  // when posting a written review
  async writeReview() {
    //  Set post sending to true to disable buttons
    this.postSending = true;

    //  Get value form html for rating
    let ratingValue: string = (<HTMLSelectElement>(
      document.getElementById('rating')
    )).value;
    //  Get value form html for description
    let descriptionValue: string = (<HTMLSelectElement>(
      document.getElementById('description')
    )).value;

    // set value based on what string was give
    let ratingIDVale: string =
      ratingValue === 'Highly Recommend'
        ? '5'
        : ratingValue === 'Recommend'
        ? '4'
        : ratingValue === 'By Partial'
        ? '3'
        : ratingValue === 'Not Recommend'
        ? '2'
        : '1';

    // Post review
    await lastValueFrom(
      this.AwsGatewayService.postReview(
        ratingValue,
        ratingIDVale,
        descriptionValue,
        this.userName,
        this.gameSlug,
        this.game.name
      )
    );

    location.reload();
    // Wait for 3 seconds
    // This does the job for now not prefect change later
    // setTimeout(() => location.reload(), 3000);
  }
}
