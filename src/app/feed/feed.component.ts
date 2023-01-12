import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AwsGatewayService } from '../services/aws-gateway.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  // Where reviews fetched will be stored
  reviews: any[];

  // Checks if reviews have been tried to be fetched
  reviewsFetched: boolean;

  // Value we will filter reviews by in the database
  filterValue: string;

  // type of reviews we looking for by in the database
  reviewType: string;

  // path of URL
  urlIDElement: string;

  constructor(
    private AwsGatewayService: AwsGatewayService,
    private activatedRoute: ActivatedRoute
  ) {
    // Declaring variables
    this.reviews = [];
    this.reviewsFetched = false;
    this.urlIDElement = String(this.activatedRoute.snapshot.paramMap.get('id'));
    this.filterValue = '';
    this.reviewType = '';

    // Looking for all reviews
    if (this.urlIDElement === 'all') {
      this.filterValue = 'none';
      this.reviewType = 'all';
    }

    // Currently only looking for individual reviews (In future will have friend system to look for only friends reviews)
    else {
      this.filterValue = this.urlIDElement;
      this.reviewType = 'singleUser';
    }
  }

  ngOnInit(): void {
    this.getReviews();
  }

  // This function get reviews based on filterValue and reviewType
  getReviews(): void {
    this.AwsGatewayService.getReviews(
      this.reviewType,
      this.filterValue
    ).subscribe((data: any[]) => {
      // Make sure the is data
      if (data !== null) {
        // set reviews to data
        this.reviews = data;
      }

      // Console log information gotten
      console.log('Information on reviews:', this.reviews);

      // Set flag that reviews have been attempted to be fetched
      this.reviewsFetched = true;
    });
  }
}
