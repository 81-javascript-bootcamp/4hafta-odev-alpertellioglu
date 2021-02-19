import data from "./data.js";
import { searchMovieByTitle, makeBgActive, makeBgPassive } from "./helpers.js";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

class MoviesApp {
  constructor(options) {
    const {
      root,
      searchInput,
      searchForm,
      yearHandler,
      genreHandler,
      yearSubmitter,
      genreSubmitter,
    } = options;
    this.$tableEl = document.getElementById(root);
    this.$tbodyEl = this.$tableEl.querySelector("tbody");

    this.$searchInput = document.getElementById(searchInput);
    this.$searchForm = document.getElementById(searchForm);
    this.yearHandler = yearHandler;
    this.genreHandler = genreHandler;
    this.$yearSubmitter = document.getElementById(yearSubmitter);
    this.$genreSubmitter = document.getElementById(genreSubmitter);
  }

  createMovieEl(movie) {
    const { image, title, genre, year, id } = movie;
    return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`;
  }

  fillTable() {
    /* const moviesHTML = data.reduce((acc, cur) => {
            return acc + this.createMovieEl(cur);
        }, "");*/
    const moviesArr = data
      .map((movie) => {
        return this.createMovieEl(movie);
      })
      .join("");
    this.$tbodyEl.innerHTML = moviesArr;
  }

  reset() {
    this.$tbodyEl.querySelectorAll("tr").forEach((item) => {
      item.style.background = "transparent";
    });
  }

  handleSearch() {
    this.$searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.reset();

      const searchValue = this.$searchInput.value;
      const matchedMovies = data
        .filter((movie) => {
          return searchMovieByTitle(movie, searchValue);
        })
        .forEach(makeBgActive);
      this.$searchInput.value = "";
    });
  }

  handleYearFilter() {
    this.$yearSubmitter.addEventListener("click", () => {
      this.reset();
      const selectedYear = document.querySelector(
        `input[name='${this.yearHandler}']:checked`
      ).value;
      const matchedMovies = data
        .filter((movie) => {
          return movie.year === selectedYear;
        })
        .forEach(makeBgActive);
    });
  }

  ////Start: Homework

  ////Start: Fill year box
  getSortedYears() {
    const years = data.map((movie) => {
      return movie.year;
    });

    years.sort(function (a, b) {
      return a - b;
    });
    return years;
  }

  getYearAmounts() {
    let years = this.getSortedYears();

    let amounts = [];
    let counter = 1;
    for (let i = 0; i < years.length; i++) {
      if (years[i] === years[i + 1]) {
        counter++;
      } else {
        amounts.push(counter);
        counter = 1;
      }
    }
    return amounts;
  }

  getUniqueYears() {
    let years = this.getSortedYears();

    const uniqueYears = years.filter(onlyUnique);

    return uniqueYears;
  }

  getUniqueYearsWithAmount() {
    let amounts = this.getYearAmounts();
    let uniqueYears = this.getUniqueYears();
    let uniqueYearsWithAmount = [];

    for (let i = 0; i < amounts.length; i++) {
      uniqueYearsWithAmount.push({ year: uniqueYears[i], amount: amounts[i] });
    }
    return uniqueYearsWithAmount;
  }

  createYearDiv(yearWithAmount) {
    return `<div class="form-check"><input class="form-check-input" type="radio" name="year" id=${
      yearWithAmount.year
    } value=${yearWithAmount.year}><label class="form-check-label" for=${
      yearWithAmount.year
    }>${
      yearWithAmount.year + " (" + yearWithAmount.amount + ")"
    }</label></div>`;
  }

  fillYearFilters() {
    const uniqueYearsWithAmount = this.getUniqueYearsWithAmount();
    uniqueYearsWithAmount.forEach((yearWithAmount) => {
      document.getElementById("filter-box").innerHTML += this.createYearDiv(
        yearWithAmount
      );
    });
  }
  ////End: Fill year box

  ////Start: Fill genre box
  getSortedGenres() {
    const genres = data.map((movie) => {
      return movie.genre;
    });

    genres.sort();
    return genres;
  }

  getGenreAmounts() {
    let genres = this.getSortedGenres();

    let amounts = [];
    let counter = 1;
    for (let i = 0; i < genres.length; i++) {
      if (genres[i] === genres[i + 1]) {
        counter++;
      } else {
        amounts.push(counter);
        counter = 1;
      }
    }
    return amounts;
  }

  getUniqueGenres() {
    let genres = this.getSortedGenres();

    const uniqueGenres = genres.filter(onlyUnique);

    return uniqueGenres;
  }

  getUniqueGenresWithAmount() {
    let amounts = this.getGenreAmounts();
    let uniqueGenres = this.getUniqueGenres();
    let uniqueGenresWithAmount = [];

    for (let i = 0; i < amounts.length; i++) {
      uniqueGenresWithAmount.push({
        type: uniqueGenres[i],
        amount: amounts[i],
      });
    }
    return uniqueGenresWithAmount;
  }

  createGenreDiv(genreWithAmount) {
    return `<div class="form-check"><input class="form-check-input" type="checkbox" name="genre" id=${
      genreWithAmount.type
    } value=${
      genreWithAmount.type
    }><label class="form-check-label" for="flexCheckDefault">
    ${
      genreWithAmount.type + " (" + genreWithAmount.amount + ")"
    }</label></div>`;
  }

  fillGenreFilters() {
    const uniqueGenresWithAmount = this.getUniqueGenresWithAmount();
    uniqueGenresWithAmount.forEach((genreWithAmount) => {
      document.getElementById("genre-box").innerHTML += this.createGenreDiv(
        genreWithAmount
      );
    });
  }

  ////End: Fill genre box

  ////Start: Filter by genre

  handleGenreFilter() {
    this.$genreSubmitter.addEventListener("click", () => {
      const selectedGenres = document.querySelectorAll(
        `input[name='${this.genreHandler}']:checked`
      );

      const selectedGenreIds = Array.from(selectedGenres).map((e) => e.id);
      console.log(selectedGenreIds);
      const matchedMovies = data
        .filter((movie) => {
          let dummy = false;
          for (let i = 0; i < selectedGenreIds.length; i++) {
            if (selectedGenreIds[i] === movie.genre) {
              dummy = true;
            }
          }
          return dummy;
        })
        .forEach(makeBgActive);

      const unMatchedMovies = data
        .filter((movie) => {
          let dummy = false;
          for (let i = 0; i < selectedGenreIds.length; i++) {
            if (selectedGenreIds[i] === movie.genre) {
              dummy = true;
            }
          }
          return !dummy;
        })
        .forEach(makeBgPassive);
    });
  }

  ////End: Filter by genre

  ////End: Homework

  init() {
    this.fillTable();
    this.handleSearch();
    this.handleYearFilter();
    this.fillYearFilters();
    this.fillGenreFilters();
    this.handleGenreFilter();
  }
}

let myMoviesApp = new MoviesApp({
  root: "movies-table",
  searchInput: "searchInput",
  searchForm: "searchForm",
  yearHandler: "year",
  genreHandler: "genre",
  yearSubmitter: "yearSubmitter",
  genreSubmitter: "genreSubmitter",
});

myMoviesApp.init();
