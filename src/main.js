import {createTripInfoTemplate} from './components/trip-info.js';
import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createTripSortTemplate} from './components/trip-sort.js';
import {createAddEditTripTemplate} from './components/add-edit-trip.js';
import {createTripCardsBoardTemplate} from './components/board.js';
import {createTripCardTemplate} from './components/trip-card.js';

const TRIP_CARDS_COUNT = 3;

const render = (container, element, position) => {
  container.insertAdjacentHTML(position, element);
};

const renderTripCards = (count) => {
  for (let i = 0; i < count; i++) {
    render(tripCardsContainer, createTripCardTemplate(), `beforeend`);
  }
};

const tripInfoContainer = document.querySelector(`.trip-info`);

render(tripInfoContainer, createTripInfoTemplate(), `afterbegin`);

const menuContainer = document.querySelector(`.trip-controls h2:nth-of-type(1)`);

render(menuContainer, createMenuTemplate(), `afterend`);

const filtersContainer = document.querySelector(`.trip-controls h2:nth-of-type(2)`);

render(filtersContainer, createFiltersTemplate(), `afterend`);

const tripEventsContainer = document.querySelector(`.trip-events`);

render(tripEventsContainer, createTripSortTemplate(), `beforeend`);

render(tripEventsContainer, createAddEditTripTemplate(), `beforeend`);

render(tripEventsContainer, createTripCardsBoardTemplate(), `beforeend`);

const tripCardsContainer = document.querySelector(`.trip-days`);

renderTripCards(TRIP_CARDS_COUNT);
