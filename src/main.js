import {generateEvents, generateOffers} from './mock/events.js';
import {render, RenderPosition} from './utils/render.js';
import FiltersController from './controllers/filters-controller.js';
import Menu from './components/menu.js';
import TripController from './controllers/trip-controller.js';
import PointsModel from './models/points-model.js';

const TRIP_EVENTS_COUNT = 10;
const offers = generateOffers();
const tripEvents = generateEvents(TRIP_EVENTS_COUNT, offers);
const pointsModel = new PointsModel();
pointsModel.setOffers(offers);
pointsModel.setEvents(tripEvents);

const menuContainer = document.querySelector(`.trip-controls h2:nth-of-type(1)`);
render(menuContainer, new Menu(), RenderPosition.AFTER);
document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => tripController.createEvent());

const filtersContainer = document.querySelector(`.trip-controls h2:nth-of-type(2)`);
const filtersController = new FiltersController(filtersContainer, pointsModel);
filtersController.render();

const tripEventsContainer = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsContainer, pointsModel);
tripController.render();
