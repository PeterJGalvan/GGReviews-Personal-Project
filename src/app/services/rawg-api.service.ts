import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, Observable, throwError } from 'rxjs';
import { FiltersInfo } from '../models/filters-info.model';
import { GameInfo } from '../models/game-info.model';
import { GamesInfo } from '../models/games-info.model';

@Injectable({
  providedIn: 'root',
})
export class RawgAPIService {
  private baseURL: string = 'https://api.rawg.io/api';
  private key: string = '0458d80756654cb98061d85de76c3560';
  public searchType: string = '&search_exact=true';
  public filterString: string = '';
  public searchString: string = '';
  public gameCount: number = 0;
  public previous: string = '';
  public next: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  getGenres(): Observable<FiltersInfo[]> {
    return this.http
      .get(this.baseURL + '/genres?key=' + this.key + '&ordering=name')
      .pipe(
        map((data: any) => {
          const genresArray: FiltersInfo[] = [];
          let index: number = 0;

          while (index < data['results'].length) {
            let genresDetails: FiltersInfo = {
              id: 'genres' + data['results'][index]['id'],
              idForDB: data['results'][index]['id'],
              slug: data['results'][index]['slug'],
              name: data['results'][index]['name'],
              filterType: 'genres',
            };

            index++;

            genresArray.push(genresDetails);
          }

          return genresArray;
        })
      );
  }

  getPlatform(): Observable<FiltersInfo[]> {
    return this.http
      .get(
        this.baseURL +
          '/platforms/lists/parents?key=' +
          this.key +
          '&ordering=id'
      )
      .pipe(
        map((data: any) => {
          let pc: number = 0;
          let playstation: number = 1;
          let xbox: number = 2;
          let nintendo: number = 6;

          let platformsWanted: number[] = [pc, playstation, xbox, nintendo];
          let outerIndex: number = 0;
          let innerIndex: number = 0;

          const platformArray: FiltersInfo[] = [];

          while (outerIndex < platformsWanted.length) {
            innerIndex = 0;
            while (
              innerIndex <
              data['results'][platformsWanted[outerIndex]]['platforms'].length
            ) {
              let platformData: FiltersInfo = {
                id:
                  'platforms' +
                  data['results'][platformsWanted[outerIndex]]['platforms'][
                    innerIndex
                  ]['id'],
                idForDB:
                  data['results'][platformsWanted[outerIndex]]['platforms'][
                    innerIndex
                  ]['id'],
                slug: data['results'][platformsWanted[outerIndex]]['platforms'][
                  innerIndex
                ]['slug'],
                name: data['results'][platformsWanted[outerIndex]]['platforms'][
                  innerIndex
                ]['name'],
                filterType: 'platforms',
              };

              platformArray.push(platformData);
              innerIndex++;
            }
            outerIndex++;
          }

          return platformArray;
        })
      );
  }

  getGamesInfo(
    URL: string = this.baseURL +
      '/games?key=' +
      this.key +
      this.filterString +
      this.searchString +
      this.searchType
  ): Observable<GamesInfo[]> {
    return this.http.get(URL).pipe(
      map((data: any) => {
        this.gameCount = data['count'];
        this.next = data['next'];
        this.previous = data['previous'];

        let index: number = 0;
        const gamesArray: GamesInfo[] = [];

        while (index < data['results'].length) {
          let gamesDetails: GamesInfo = {
            id: 'games' + data['results'][index]['id'],
            idForDB: data['results'][index]['id'],
            name: data['results'][index]['name'],
            slug: data['results'][index]['slug'],
            backgroundImg: data['results'][index]['background_image'],
          };

          gamesArray.push(gamesDetails);
          index++;
        }

        window.scrollTo(0, 0);
        return gamesArray;
      })
    );
  }

  getGameInfo(id: string): Observable<GameInfo> {
    return this.http
      .get(this.baseURL + '/games/' + id + '?key=' + this.key)
      .pipe(
        map((data: any) => {
          let gamesDetails: GameInfo = {
            id: 'game' + data['id'],
            idForDB: data['id'],
            name: data['name'],
            slug: data['slug'],
            description: data['description_raw'],
            released: data['released'],
            backgroundImg: data['background_image'],
          };

          console.log('this game does existed', gamesDetails);

          window.scrollTo(0, 0);
          return gamesDetails;
        }),
        catchError((err: any) => {
          this.router.navigate(['home']);
          window.scrollTo(0, 0);

          console.log('this game does not existed');

          return throwError(err);
        })
      );
  }
}
