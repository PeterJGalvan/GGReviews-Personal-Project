import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AwsGatewayService {
  private baseURL: string =
    'https://hb8coc03j6.execute-api.us-east-2.amazonaws.com/GGReview-API';

  constructor(private http: HttpClient) {}

  postReview(
    ratingValue: string,
    ratingIDVale: string,
    descriptionValue: string,
    userName: string,
    gameSlug: string,
    gameName: string
  ) {
    return this.http.post(this.baseURL + '/reviews', {
      Rating: ratingValue,
      RatingID: ratingIDVale,
      DescriptionValue: descriptionValue,
      UserName: userName,
      GameSlug: gameSlug,
      GameName: gameName,
    });
  }

  postProfileStats(userName: string): void {
    this.http
      .post(this.baseURL + '/userstats', {
        UserName: userName,
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  getReviews(reviewType: string, filterValue: string): any {
    return this.http
      .get(
        this.baseURL +
          '/reviews/' +
          '?reviewType=' +
          reviewType +
          '&filterValue=' +
          filterValue
      )
      .pipe(
        map((data: any) => {
          if (data !== null) {
            const reviewArray: any = [];
            let index: number = 0;

            while (index < data.length) {
              let reviewDetails: any = {
                descriptionValue: data[index]['DescriptionValue']['S'],
                gameName: data[index]['GameName']['S'],
                gameSlug: data[index]['GameSlug']['S'],
                rating: data[index]['Rating']['S'],
                ratingID: data[index]['RatingID']['N'],
                userName: data[index]['UserName']['S'],
              };

              index++;

              reviewArray.push(reviewDetails);
            }

            return reviewArray;
          } else {
            return null;
          }
        })
      );
  }

  getAverageRating(gameSlug: string): any {
    return this.http
      .get(this.baseURL + '/reviews/averagerating/' + '?game=' + gameSlug)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  checkForReview(gameSlug: string, userName: string): any {
    return this.http
      .get(
        this.baseURL +
          '/reviews/checkcompletion' +
          '?game=' +
          gameSlug +
          '&userName=' +
          userName
      )
      .pipe(
        map((data: any) => {
          if (data !== null) {
            const personalreviewArray: any = [];

            let reviewDetails: any = {
              descriptionValue: data['DescriptionValue']['S'],
              rating: data['Rating']['S'],
              ratingID: data['RatingID']['N'],
            };

            personalreviewArray.push(reviewDetails);
            return personalreviewArray;
          } else {
            return null;
          }
        })
      );
  }

  getProfileStats(userName: string): any {
    return this.http
      .get(this.baseURL + '/userstats/' + '?userName=' + userName)
      .pipe(
        map((data: any) => {
          if (data !== null) {
            const profileStatsArray: any = [];

            let profileStatsDetails: any = {
              FollowerCount: data['FollowerCount']['N'],
              FollowingCount: data['FollowingCount']['N'],
              ReviewCount: data['ReviewCount']['N'],
              userName: data['UserName']['S'],
              PictureURL: data['PictureURL']['S'],
            };

            profileStatsArray.push(profileStatsDetails);

            return profileStatsArray;
          } else {
            return null;
          }
        })
      );
  }
}
