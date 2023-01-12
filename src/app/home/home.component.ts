import { Component, OnInit } from '@angular/core';
import { FiltersInfo } from '../models/filters-info.model';
import { GamesInfo } from '../models/games-info.model';
import { RawgAPIService } from '../services/rawg-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // Information displayed on page
  games: GamesInfo[];
  genres: FiltersInfo[];
  platforms: FiltersInfo[];
  gameCount: number;
  next: string;
  previous: string;

  // keeping track of filters and make it a useable string
  itemsChecked: FiltersInfo[];

  // For making visible when needed
  isVisibleClear = false;
  isVisibleClearErr = false;

  // For Arrows on filter bar
  genresArrowDown = true;
  platformsArrowDown = true;

  // class that changes when filter bar is collapsed
  imgClass: string = 'gameImagesFilterBarShown';

  // checks if gamesInfo has ran
  gamesInfoDone: boolean = false;

  searchString: string;

  constructor(private RawgAPIService: RawgAPIService) {
    this.searchString = '';
    this.gameCount = 0;
    this.next = '';
    this.previous = '';
    this.itemsChecked = [];
    this.platforms = [];
    this.genres = [];
    this.games = [];
  }

  ngOnInit(): void {
    // rest filter string on page load
    this.RawgAPIService.filterString = '';
    this.RawgAPIService.searchString = '';

    // get info on page load
    this.getGenres();
    this.getPlatforms();
    this.getGamesInfo();
  }

  displayTypeForFilterBar() {
    if (document.getElementById('filterBarDiv')?.style.display !== 'none') {
      document.getElementById('filterBarDiv')!.style.display = 'none';
      document.getElementById('nonFilterBarDiv')!.style.display = 'block';

      this.imgClass = 'gameImagesFilterBarNotShown';
    } else {
      document.getElementById('filterBarDiv')!.style.display = 'block';
      document.getElementById('nonFilterBarDiv')!.style.display = 'none';

      this.imgClass = 'gameImagesFilterBarShown';
    }
  }

  displayTypeForGenre() {
    if (document.getElementById('genresDiv')?.style.display !== 'none') {
      document.getElementById('genresDiv')!.style.display = 'none';
      this.genresArrowDown = true;
    } else {
      document.getElementById('genresDiv')!.style.display = 'block';
      this.genresArrowDown = false;
    }
  }

  displayTypeForPlatform() {
    if (document.getElementById('platformsDiv')?.style.display !== 'none') {
      document.getElementById('platformsDiv')!.style.display = 'none';
      this.platformsArrowDown = true;
    } else {
      document.getElementById('platformsDiv')!.style.display = 'block';
      this.platformsArrowDown = false;
    }
  }

  checkBoxChanged(filterClicked: FiltersInfo) {
    const cb = <HTMLInputElement>document.getElementById(filterClicked.id);

    if (cb.checked === false) {
      this.itemsChecked = this.itemsChecked.filter(
        (value) => value.id !== filterClicked.id
      );
    } else {
      this.itemsChecked.push(filterClicked);
    }

    console.log('checkBoxes clicked', this.itemsChecked);
  }

  clear() {
    // reset filter string
    this.RawgAPIService.filterString = '';
    this.RawgAPIService.searchString = '';
    this.searchString = '';

    // Get rid of error if any and clear button no longer needed
    this.isVisibleClear = false;
    this.isVisibleClearErr = false;

    let index: number = 0;
    while (index < this.itemsChecked.length) {
      let cb;

      // check if it is filter type genre
      if (this.itemsChecked[index].filterType === 'genres') {
        cb = <HTMLInputElement>(
          document.getElementById(this.itemsChecked[index].id)
        );
      }
      // else it is platform
      else {
        cb = <HTMLInputElement>(
          document.getElementById(this.itemsChecked[index].id)
        );
      }

      // clear all checkboxes
      cb.checked = false;
      index++;
    }
    // get OG get info
    this.getGamesInfo();

    // reset itemsChecked
    this.itemsChecked = [];

    console.log('Item checked should be empty', this.itemsChecked.length === 0);

    // scroll to top of screen
    window.scrollTo(0, 0);
  }

  filter() {
    if (this.itemsChecked.length > 0 || this.searchString !== '') {
      this.RawgAPIService.searchString = '&search=' + this.searchString;

      let index: number = 0;
      let platformsString: string = '';
      let genreString: string = '';
      while (index < this.itemsChecked.length) {
        if (this.itemsChecked[index].filterType === 'genres') {
          if (genreString === '') {
            genreString = '&genres=';
          }

          genreString += this.itemsChecked[index].idForDB + ',';
        } else {
          if (platformsString === '') {
            platformsString = '&platforms=';
          }

          platformsString += this.itemsChecked[index].idForDB + ',';
        }
        index++;
      }

      this.RawgAPIService.filterString = genreString + platformsString;

      console.log('Filter String:', this.RawgAPIService.filterString);

      this.isVisibleClear = true;
      this.isVisibleClearErr = false;
    } else {
      this.isVisibleClearErr = true;
    }

    if (this.RawgAPIService.filterString || this.searchString !== '') {
      this.getGamesInfo();

      if (!this.isVisibleClearErr) {
        window.scrollTo(0, 0);
      }
    }
  }

  getGamesInfo(customURL: string = '') {
    this.gamesInfoDone = false;
    this.games = [];

    if (customURL === '') {
      this.RawgAPIService.getGamesInfo().subscribe((data: any[]) => {
        if (data.length === 0) {
          this.RawgAPIService.searchType = '&search_precise=true';

          this.RawgAPIService.getGamesInfo().subscribe((data: any[]) => {
            this.games = data;
            this.gameCount = this.RawgAPIService.gameCount;
            this.next = this.RawgAPIService.next;
            this.previous = this.RawgAPIService.previous;
            this.gamesInfoDone = true;

            this.RawgAPIService.searchType = '&search_exact=true';
          });
        } else {
          this.games = data;
          this.gameCount = this.RawgAPIService.gameCount;
          this.next = this.RawgAPIService.next;
          this.previous = this.RawgAPIService.previous;
          this.gamesInfoDone = true;
        }

        console.log('Information on games:', this.games);
      });
    } else {
      this.RawgAPIService.getGamesInfo(customURL).subscribe((data: any[]) => {
        this.games = data;
        this.gameCount = this.RawgAPIService.gameCount;
        this.next = this.RawgAPIService.next;
        this.previous = this.RawgAPIService.previous;
        this.gamesInfoDone = true;

        console.log('Information on games:', this.games);
      });
    }
  }

  getGenres() {
    this.RawgAPIService.getGenres().subscribe((data: any[]) => {
      this.genres = data;

      console.log('Information on genres:', this.genres);
    });
  }

  getPlatforms() {
    this.RawgAPIService.getPlatform().subscribe((data: any[]) => {
      this.platforms = data;

      console.log('Information on platforms:', this.platforms);
    });
  }
}
