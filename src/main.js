import {generateEvents, generateOffers} from './mock/events.js';
import {render, RenderPosition} from './utils/render.js';
import FiltersController from './controllers/filters-controller.js';
import TripController from './controllers/trip-controller.js';
import Menu, {MenuItem} from './components/menu.js';
import Statisctics from './components/statistics.js';
import PointsModel from './models/points-model.js';

const TRIP_EVENTS_COUNT = 10;
const offers = generateOffers();
const tripEvents = generateEvents(TRIP_EVENTS_COUNT, offers);
const pointsModel = new PointsModel();
pointsModel.setOffers(offers);
pointsModel.setEvents(tripEvents);

const menuContainer = document.querySelector(`.trip-controls h2:nth-of-type(1)`);
const menuComponent = new Menu();
render(menuContainer, menuComponent, RenderPosition.AFTER);

const filtersContainer = document.querySelector(`.trip-controls h2:nth-of-type(2)`);
const filtersController = new FiltersController(filtersContainer, pointsModel);
filtersController.render();

const tripEventsContainer = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsContainer, pointsModel);
tripController.render();

const statisticsComponent = new Statisctics(pointsModel);
render(tripEventsContainer, statisticsComponent, RenderPosition.AFTER);
statisticsComponent.hide();
menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_EVENT:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      tripController.createEvent();
      break;
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATS:
      statisticsComponent.show();
      tripController.hide();
      break;
  }
});
