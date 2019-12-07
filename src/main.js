import {createTripInfoTemplate} from './components/trip-info.js';
import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createTripSortTemplate} from './components/trip-sort.js';
import {createAddEditEventTemplate} from './components/add-edit-event.js';
import {createTripCardsBoardTemplate} from './components/board.js';
import {createTripDaysTemplate} from './components/trip-days.js';
import {generateEvents} from './mock/events.js';

const sortEventsByDate = (events) => events.slice().sort((a, b) => a.startDate - b.startDate);

const TRIP_EVENTS_COUNT = 10;

const mockEvents = generateEvents(TRIP_EVENTS_COUNT);

const sortedEvents = sortEventsByDate(mockEvents);

const render = (container, element, position) => {
  container.insertAdjacentHTML(position, element);
};

const renderTripDays = (events) => render(tripDaysContainer, createTripDaysTemplate(events), `beforeend`);

const tripInfoContainer = document.querySelector(`.trip-info`);

render(tripInfoContainer, createTripInfoTemplate(sortedEvents), `afterbegin`);

const menuContainer = document.querySelector(`.trip-controls h2:nth-of-type(1)`);

render(menuContainer, createMenuTemplate(), `afterend`);

const filtersContainer = document.querySelector(`.trip-controls h2:nth-of-type(2)`);

render(filtersContainer, createFiltersTemplate(), `afterend`);

const tripEventsContainer = document.querySelector(`.trip-events`);

render(tripEventsContainer, createTripSortTemplate(), `beforeend`);

render(tripEventsContainer, createAddEditEventTemplate(sortedEvents[0]), `beforeend`);

render(tripEventsContainer, createTripCardsBoardTemplate(), `beforeend`);

const tripDaysContainer = document.querySelector(`.trip-days`);

renderTripDays(sortedEvents.slice(1, TRIP_EVENTS_COUNT));
