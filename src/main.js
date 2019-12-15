import {generateEvents} from './mock/events.js';
import {render, RenderPosition} from './utils/render.js';
import Filters from './components/filters.js';
import Menu from './components/menu.js';
import TripController from './controllers/trip-controller.js';

const TRIP_EVENTS_COUNT = 10;
const tripEvents = generateEvents(TRIP_EVENTS_COUNT);

const menuContainer = document.querySelector(`.trip-controls h2:nth-of-type(1)`);
render(menuContainer, new Menu(), RenderPosition.AFTER);

const filtersContainer = document.querySelector(`.trip-controls h2:nth-of-type(2)`);
render(filtersContainer, new Filters(), RenderPosition.AFTER);

const tripEventsContainer = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsContainer);
tripController.render(tripEvents);
